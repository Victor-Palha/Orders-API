import { Injectable } from "@nestjs/common";
import {
	type ListOrdersParams,
	type ListOrdersResult,
	type ListAllOrdersParams,
	type ListAllOrdersResult,
	OrderRepository,
} from "@/domain/orders/application/repositories/order-repository";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { KnexService } from "../knex/knex.service";
import { OrderMapper, type OrderRow } from "../mappers/order-mapper";
import { KnexOrderItemRepository } from "./knex-order-item-repository";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class KnexOrderRepository implements OrderRepository {
	private readonly tableName = "orders";

	constructor(
		private knex: KnexService,
		private orderItemRepository: KnexOrderItemRepository
	) { }

	async findById(id: string): Promise<OrderEntity | null> {
		const row = await this.knex.table<OrderRow>(this.tableName).where({ id }).first();

		if (!row) {
			return null;
		}

		const order = OrderMapper.toEntity(row);
		const items = await this.orderItemRepository.findByOrderId(id);
		order.items = items;

		return order;
	}

	async findByIdAndUserId(id: string, userId: string): Promise<OrderEntity | null> {
		const row = await this.knex
			.table<OrderRow>(this.tableName)
			.where({ id, user_id: userId })
			.first();

		if (!row) {
			return null;
		}

		const order = OrderMapper.toEntity(row);
		const items = await this.orderItemRepository.findByOrderId(id);
		order.items = items;

		return order;
	}

	async create(order: OrderEntity): Promise<void> {
		await this.knex.table(this.tableName).insert(OrderMapper.toRow(order));
		DomainEvents.dispatchEventsForAggregate(order.id);
	}

	async update(order: OrderEntity): Promise<void> {
		const row = OrderMapper.toRow(order);
		const { id, ...updateData } = row;

		await this.knex.table(this.tableName).where({ id }).update(updateData);
	}

	async delete(id: string): Promise<void> {
		await this.knex.table(this.tableName).where({ id }).delete();
	}

	async listOrders(params: ListOrdersParams): Promise<ListOrdersResult> {
		const {
			userId,
			status,
			page = 1,
			limit = 10,
			sortBy = "created_at",
			sortOrder = "DESC",
		} = params;

		const sanitizedLimit = Math.min(Math.max(limit, 1), 100);
		let query = this.knex.table<OrderRow>(this.tableName).where({ user_id: userId });

		if (status) {
			query = query.where({ status });
		}

		const result = (await query.clone().count("* as count").first()) as
			| { count: string | number | bigint }
			| undefined;
		const totalCount = result ? Number(result.count) : 0;

		const rows = await query
			.orderBy(sortBy, sortOrder)
			.limit(sanitizedLimit)
			.offset((page - 1) * sanitizedLimit);

		const orderIds = rows.map(row => row.id);
		const allItems =
			orderIds.length > 0 ? await this.orderItemRepository.findByOrderIds(orderIds) : [];

		const orders = rows.map(row => {
			const order = OrderMapper.toEntity(row);
			order.items = allItems.filter(item => item.props.orderId.toValue() === order.id.toValue());
			return order;
		});

		return {
			orders,
			total: totalCount,
			page,
			limit: sanitizedLimit,
			totalPages: Math.ceil(totalCount / sanitizedLimit),
		};
	}

	async listAllOrders(params: ListAllOrdersParams): Promise<ListAllOrdersResult> {
		const {
			status,
			page = 1,
			limit = 10,
			sortBy = "created_at",
			sortOrder = "DESC",
		} = params;

		const sanitizedLimit = Math.min(Math.max(limit, 1), 100);
		let query = this.knex.table<OrderRow>(this.tableName);

		if (status) {
			query = query.where({ status });
		}

		const result = (await query.clone().count("* as count").first()) as
			| { count: string | number | bigint }
			| undefined;
		const totalCount = result ? Number(result.count) : 0;

		const rows = await query
			.orderBy(sortBy, sortOrder)
			.limit(sanitizedLimit)
			.offset((page - 1) * sanitizedLimit);

		const orderIds = rows.map(row => row.id);
		const allItems =
			orderIds.length > 0 ? await this.orderItemRepository.findByOrderIds(orderIds) : [];

		const orders = rows.map(row => {
			const order = OrderMapper.toEntity(row);
			order.items = allItems.filter(item => item.props.orderId.toValue() === order.id.toValue());
			return order;
		});

		return {
			orders,
			total: totalCount,
			page,
			limit: sanitizedLimit,
			totalPages: Math.ceil(totalCount / sanitizedLimit),
		};
	}
}
