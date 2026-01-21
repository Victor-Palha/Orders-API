import { Injectable } from "@nestjs/common";
import { OrderItemRepository } from "@/domain/orders/application/repositories/order-item-repository";
import { OrderItemEntity } from "@/domain/orders/enterprise/order-item-entity";
import { KnexService } from "../knex/knex.service";
import { OrderItemMapper, type OrderItemRow } from "../mappers/order-item-mapper";

@Injectable()
export class KnexOrderItemRepository implements OrderItemRepository {
	private readonly tableName = "order_items";

	constructor(private knex: KnexService) {}

	async findById(id: string): Promise<OrderItemEntity | null> {
		const row = await this.knex.table<OrderItemRow>(this.tableName).where({ id }).first();

		if (!row) {
			return null;
		}

		return OrderItemMapper.toEntity(row);
	}

	async findByOrderId(orderId: string): Promise<OrderItemEntity[]> {
		const rows = await this.knex.table<OrderItemRow>(this.tableName).where({ order_id: orderId });

		return rows.map(row => OrderItemMapper.toEntity(row));
	}

	async create(orderItem: OrderItemEntity): Promise<void> {
		await this.knex.table(this.tableName).insert(OrderItemMapper.toRow(orderItem));
	}

	async createMany(orderItems: OrderItemEntity[]): Promise<void> {
		const rows = orderItems.map(item => OrderItemMapper.toRow(item));
		await this.knex.table(this.tableName).insert(rows);
	}

	async update(orderItem: OrderItemEntity): Promise<void> {
		const row = OrderItemMapper.toRow(orderItem);
		const { id, ...updateData } = row;

		await this.knex.table(this.tableName).where({ id }).update(updateData);
	}

	async delete(id: string): Promise<void> {
		await this.knex.table(this.tableName).where({ id }).delete();
	}

	async deleteByOrderId(orderId: string): Promise<void> {
		await this.knex.table(this.tableName).where({ order_id: orderId }).delete();
	}
}
