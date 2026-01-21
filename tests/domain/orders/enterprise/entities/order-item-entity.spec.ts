import { describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderItemEntity, type OrderItemProps } from "@/domain/orders/enterprise/order-item-entity";

describe("OrderItem Entity", () => {
	const validProps: OrderItemProps = {
		orderId: new UniqueEntityID("order-123"),
		productId: 101,
		productName: "Mouse Gamer",
		quantity: 2,
		unitPrice: 149.99,
		totalPrice: 299.98,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	it("Should be able to create an order item entity without id", () => {
		const orderItem = OrderItemEntity.create(validProps);
		expect(orderItem).toBeInstanceOf(OrderItemEntity);
		expect(orderItem.props).toEqual(validProps);
		expect(orderItem.id).toBeDefined();
	});

	it("Should be able to create an order item entity with id", () => {
		const id = "custom-order-item-id-456";
		const orderItem = OrderItemEntity.create(validProps, id);
		expect(orderItem).toBeInstanceOf(OrderItemEntity);
		expect(orderItem.props).toEqual(validProps);
		expect(orderItem.id.toValue()).toBe(id);
	});

	it("Should calculate total price automatically when not provided", () => {
		const propsWithoutTotal = {
			orderId: new UniqueEntityID("order-123"),
			productId: 101,
			productName: "Mouse Gamer",
			quantity: 2,
			unitPrice: 149.99,
		};
		const orderItem = OrderItemEntity.create(propsWithoutTotal);
		expect(orderItem.props.totalPrice).toBe(299.98);
	});

	it("Should be able to get order item properties", () => {
		const orderItem = OrderItemEntity.create(validProps);
		expect(orderItem.props.orderId).toBe(validProps.orderId);
		expect(orderItem.props.productId).toBe(validProps.productId);
		expect(orderItem.props.productName).toBe(validProps.productName);
		expect(orderItem.props.quantity).toBe(validProps.quantity);
		expect(orderItem.props.unitPrice).toBe(validProps.unitPrice);
		expect(orderItem.props.totalPrice).toBe(validProps.totalPrice);
		expect(orderItem.props.createdAt).toBe(validProps.createdAt);
		expect(orderItem.props.updatedAt).toBe(validProps.updatedAt);
	});
});
