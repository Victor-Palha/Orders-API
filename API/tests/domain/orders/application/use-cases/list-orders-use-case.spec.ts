import { beforeEach, describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ListOrdersUseCase } from "@/domain/orders/application/use-cases/list-orders-use-case";
import { StatusEnum } from "@/domain/orders/enterprise/enums/status.enum";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { Status } from "@/domain/orders/enterprise/value-object/status";
import { InMemoryOrderItemRepository } from "../repositories/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "../repositories/in-memory-order-repository";

describe("List Orders Use Case", () => {
	let orderRepository: InMemoryOrderRepository;
	let orderItemRepository: InMemoryOrderItemRepository;
	let sut: ListOrdersUseCase;

	beforeEach(() => {
		orderItemRepository = new InMemoryOrderItemRepository();
		orderRepository = new InMemoryOrderRepository(orderItemRepository);
		sut = new ListOrdersUseCase(orderRepository);
	});

	it("should be able to list orders for a user", async () => {
		const order1 = OrderEntity.create({
			name: "Order 1",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 100.0,
			createdAt: new Date("2024-01-20"),
			updatedAt: new Date("2024-01-20"),
		});

		const order2 = OrderEntity.create({
			name: "Order 2",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PROCESSING),
			totalAmount: 200.0,
			createdAt: new Date("2024-01-21"),
			updatedAt: new Date("2024-01-21"),
		});

		await orderRepository.create(order1);
		await orderRepository.create(order2);

		const result = await sut.execute({
			userId: "user-123",
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders).toHaveLength(2);
			expect(result.value.meta.total).toBe(2);
		}
	});

	it("should filter orders by status", async () => {
		const pendingOrder = OrderEntity.create({
			name: "Pending Order",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 100.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const processingOrder = OrderEntity.create({
			name: "Processing Order",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PROCESSING),
			totalAmount: 200.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await orderRepository.create(pendingOrder);
		await orderRepository.create(processingOrder);

		const result = await sut.execute({
			userId: "user-123",
			status: StatusEnum.PENDING,
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders).toHaveLength(1);
			expect(result.value.orders[0].props.status.value).toBe(StatusEnum.PENDING);
		}
	});

	it("should paginate results correctly", async () => {
		// Create 15 orders
		for (let i = 1; i <= 15; i++) {
			const order = OrderEntity.create({
				name: `Order ${i}`,
				userId: new UniqueEntityID("user-123"),
				status: Status.create(StatusEnum.PENDING),
				totalAmount: i * 10,
				createdAt: new Date(`2024-01-${i.toString().padStart(2, "0")}`),
				updatedAt: new Date(`2024-01-${i.toString().padStart(2, "0")}`),
			});
			await orderRepository.create(order);
		}

		const result = await sut.execute({
			userId: "user-123",
			page: 1,
			limit: 10,
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders).toHaveLength(10);
			expect(result.value.meta.total).toBe(15);
			expect(result.value.meta.totalPages).toBe(2);
			expect(result.value.meta.page).toBe(1);
		}
	});

	it("should return second page correctly", async () => {
		// Create 15 orders
		for (let i = 1; i <= 15; i++) {
			const order = OrderEntity.create({
				name: `Order ${i}`,
				userId: new UniqueEntityID("user-123"),
				status: Status.create(StatusEnum.PENDING),
				totalAmount: i * 10,
				createdAt: new Date(`2024-01-${i.toString().padStart(2, "0")}`),
				updatedAt: new Date(`2024-01-${i.toString().padStart(2, "0")}`),
			});
			await orderRepository.create(order);
		}

		const result = await sut.execute({
			userId: "user-123",
			page: 2,
			limit: 10,
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders).toHaveLength(5);
			expect(result.value.meta.page).toBe(2);
		}
	});

	it("should sort orders by createdAt DESC by default", async () => {
		const order1 = OrderEntity.create({
			name: "Order 1",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 100.0,
			createdAt: new Date("2024-01-20"),
			updatedAt: new Date("2024-01-20"),
		});

		const order2 = OrderEntity.create({
			name: "Order 2",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 200.0,
			createdAt: new Date("2024-01-22"),
			updatedAt: new Date("2024-01-22"),
		});

		const order3 = OrderEntity.create({
			name: "Order 3",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 300.0,
			createdAt: new Date("2024-01-21"),
			updatedAt: new Date("2024-01-21"),
		});

		await orderRepository.create(order1);
		await orderRepository.create(order2);
		await orderRepository.create(order3);

		const result = await sut.execute({
			userId: "user-123",
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders[0].props.name).toBe("Order 2"); // Most recent
			expect(result.value.orders[1].props.name).toBe("Order 3");
			expect(result.value.orders[2].props.name).toBe("Order 1"); // Oldest
		}
	});

	it("should sort orders by totalAmount ASC", async () => {
		const order1 = OrderEntity.create({
			name: "Order 1",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 300.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const order2 = OrderEntity.create({
			name: "Order 2",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 100.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const order3 = OrderEntity.create({
			name: "Order 3",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 200.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await orderRepository.create(order1);
		await orderRepository.create(order2);
		await orderRepository.create(order3);

		const result = await sut.execute({
			userId: "user-123",
			sortBy: "totalAmount",
			sortOrder: "ASC",
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders[0].props.totalAmount).toBe(100.0);
			expect(result.value.orders[1].props.totalAmount).toBe(200.0);
			expect(result.value.orders[2].props.totalAmount).toBe(300.0);
		}
	});

	it("should only return orders for the specified user", async () => {
		const user1Order = OrderEntity.create({
			name: "User 1 Order",
			userId: new UniqueEntityID("user-123"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 100.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const user2Order = OrderEntity.create({
			name: "User 2 Order",
			userId: new UniqueEntityID("user-456"),
			status: Status.create(StatusEnum.PENDING),
			totalAmount: 200.0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await orderRepository.create(user1Order);
		await orderRepository.create(user2Order);

		const result = await sut.execute({
			userId: "user-123",
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders).toHaveLength(1);
			expect(result.value.orders[0].props.name).toBe("User 1 Order");
		}
	});

	it("should return empty list when user has no orders", async () => {
		const result = await sut.execute({
			userId: "user-without-orders",
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.orders).toHaveLength(0);
			expect(result.value.meta.total).toBe(0);
			expect(result.value.meta.totalPages).toBe(0);
		}
	});
});
