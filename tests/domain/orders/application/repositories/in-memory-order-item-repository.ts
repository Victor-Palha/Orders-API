import { OrderItemRepository } from "@/domain/orders/application/repositories/order-item-repository";
import { OrderItemEntity } from "@/domain/orders/enterprise/order-item-entity";

export class InMemoryOrderItemRepository implements OrderItemRepository {
	public orderItems: OrderItemEntity[] = [];

	async findById(id: string): Promise<OrderItemEntity | null> {
		const orderItem = this.orderItems.find(item => item.id.toValue() === id);
		return orderItem ?? null;
	}

	async findByOrderId(orderId: string): Promise<OrderItemEntity[]> {
		return this.orderItems.filter(item => item.props.orderId.toValue() === orderId);
	}

	async findByOrderIds(orderIds: string[]): Promise<OrderItemEntity[]> {
		return this.orderItems.filter(item => orderIds.includes(item.props.orderId.toValue()));
	}

	async create(orderItem: OrderItemEntity): Promise<void> {
		this.orderItems.push(orderItem);
	}

	async createMany(orderItems: OrderItemEntity[]): Promise<void> {
		this.orderItems.push(...orderItems);
	}

	async update(orderItem: OrderItemEntity): Promise<void> {
		const index = this.orderItems.findIndex(item => item.id.toValue() === orderItem.id.toValue());
		if (index !== -1) {
			this.orderItems[index] = orderItem;
		}
	}

	async delete(id: string): Promise<void> {
		const index = this.orderItems.findIndex(item => item.id.toValue() === id);
		if (index !== -1) {
			this.orderItems.splice(index, 1);
		}
	}

	async deleteByOrderId(orderId: string): Promise<void> {
		this.orderItems = this.orderItems.filter(item => item.props.orderId.toValue() !== orderId);
	}
}
