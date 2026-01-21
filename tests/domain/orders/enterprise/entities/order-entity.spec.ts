import { describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { StatusEnum } from "@/domain/orders/enterprise/enums/status.enum";
import { OrderCreatedEvent } from "@/domain/orders/enterprise/events/order-created-event";
import { OrderEntity, type OrderProps } from "@/domain/orders/enterprise/order-entity";
import { Status } from "@/domain/orders/enterprise/value-object/status";

describe("Order Entity", () => {
	const validProps: OrderProps = {
		name: "Test Order",
		userId: new UniqueEntityID("user-123"),
		status: Status.create(StatusEnum.PENDING),
		totalAmount: 99.99,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	it("Should be able to create an order entity without id", () => {
		const order = OrderEntity.create(validProps);
		expect(order).toBeInstanceOf(OrderEntity);
		expect(order.props).toEqual(validProps);
		expect(order.id).toBeDefined();
	});

	it("Should be able to create an order entity with id", () => {
		const id = "custom-order-id-456";
		const order = OrderEntity.create(validProps, id);
		expect(order).toBeInstanceOf(OrderEntity);
		expect(order.props).toEqual(validProps);
		expect(order.id.toValue()).toBe(id);
	});

	it("Should trigger OrderCreatedEvent when creating a new order without id", () => {
		const order = OrderEntity.create(validProps);
		const domainEvents = order.domainEvents;

		expect(domainEvents).toHaveLength(1);
		expect(domainEvents[0]).toBeInstanceOf(OrderCreatedEvent);
		expect(domainEvents[0].getAggregateId()).toBe(order.id.toValue());
	});

	it("Should not trigger OrderCreatedEvent when creating an order with id", () => {
		const id = "custom-order-id-456";
		const order = OrderEntity.create(validProps, id);
		const domainEvents = order.domainEvents;

		expect(domainEvents).toHaveLength(0);
	});
});
