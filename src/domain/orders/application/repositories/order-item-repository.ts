import { OrderItemEntity } from "../../enterprise/order-item-entity";

export abstract class OrderItemRepository {
	abstract findById(id: string): Promise<OrderItemEntity | null>;
	abstract findByOrderId(orderId: string): Promise<OrderItemEntity[]>;
	abstract create(orderItem: OrderItemEntity): Promise<void>;
	abstract createMany(orderItems: OrderItemEntity[]): Promise<void>;
	abstract update(orderItem: OrderItemEntity): Promise<void>;
	abstract delete(id: string): Promise<void>;
	abstract deleteByOrderId(orderId: string): Promise<void>;
}
