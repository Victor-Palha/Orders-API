import { DomainEvent } from "@/core/events/domain-event";
import { OrderEntity } from "../order-entity";

export class OrderCreatedEvent implements DomainEvent {
	public occurredAt: Date;
	public order: OrderEntity;

	constructor(order: OrderEntity) {
		this.order = order;
		this.occurredAt = new Date();
	}

	public getAggregateId(): string {
		return this.order.id.toValue();
	}
}
