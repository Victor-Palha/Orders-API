import { Injectable } from "@nestjs/common";
import {
	type ListOrdersParams,
	type ListOrdersResult,
	OrderRepository,
} from "@/domain/orders/application/repositories/order-repository";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { KnexService } from "../knex/knex.service";
import { OrderMapper, type OrderRow } from "../mappers/order-mapper";
import { KnexOrderItemRepository } from "./knex-order-item-repository";

@Injectable()
export class KnexOrderRepository implements OrderRepository {
	private readonly tableName = "orders";

	constructor(
		private knex: KnexService,
		private orderItemRepository: KnexOrderItemRepository
	) {}

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

		let query = this.knex.table<OrderRow>(this.tableName).where({ user_id: userId });

		if (status) {
			query = query.where({ status });
		}

		const total = await query.clone().count("* as count").first();
		const totalCount = Number(total) || 0;

		const rows = await query
			.orderBy(sortBy, sortOrder)
			.limit(limit)
			.offset((page - 1) * limit);

		const orders = rows.map(row => OrderMapper.toEntity(row));

		for (const order of orders) {
			const items = await this.orderItemRepository.findByOrderId(order.id.toValue());
			order.items = items;
		}

		return {
			orders,
			total: totalCount,
			page,
			limit,
			totalPages: Math.ceil(totalCount / limit),
		};
	}
}
