import { beforeEach, describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FindOrderByIdUseCase } from "@/domain/orders/application/use-cases/find-order-by-id-use-case";
import { StatusEnum } from "@/domain/orders/enterprise/enums/status.enum";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { Status } from "@/domain/orders/enterprise/value-object/status";
import { InMemoryOrderItemRepository } from "../repositories/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "../repositories/in-memory-order-repository";

describe("Find Order By Id Use Case", () => {
	let orderRepository: InMemoryOrderRepository;
	let orderItemRepository: InMemoryOrderItemRepository;
	let sut: FindOrderByIdUseCase;

	beforeEach(() => {
		orderItemRepository = new InMemoryOrderItemRepository();
		orderRepository = new InMemoryOrderRepository(orderItemRepository);
		sut = new FindOrderByIdUseCase(orderRepository);
	});

	it("should be able to find an order by id", async () => {
		const order = OrderEntity.create(
			{
				name: "Test Order",
				userId: new UniqueEntityID("user-123"),
				status: Status.create(StatusEnum.PENDING),
				totalAmount: 299.99,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			"order-1"
		);

		await orderRepository.create(order);

		const result = await sut.execute({
			id: "order-1",
			userId: "user-123",
		});

		expect(result.success()).toBe(true);
		expect(result.value).toMatchObject({
			order: expect.objectContaining({
				props: expect.objectContaining({
					name: "Test Order",
					totalAmount: 299.99,
				}),
			}),
		});
	});

	it("should return error when order does not exist", async () => {
		const result = await sut.execute({
			id: "non-existent-id",
			userId: "user-123",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return error when order belongs to another user", async () => {
		const order = OrderEntity.create(
			{
				name: "Test Order",
				userId: new UniqueEntityID("user-123"),
				status: Status.create(StatusEnum.PENDING),
				totalAmount: 299.99,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			"order-1"
		);

		await orderRepository.create(order);

		const result = await sut.execute({
			id: "order-1",
			userId: "different-user",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return the correct order when user has multiple orders", async () => {
		const order1 = OrderEntity.create(
			{
				name: "Order 1",
				userId: new UniqueEntityID("user-123"),
				status: Status.create(StatusEnum.PENDING),
				totalAmount: 100.0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			"order-1"
		);

		const order2 = OrderEntity.create(
			{
				name: "Order 2",
				userId: new UniqueEntityID("user-123"),
				status: Status.create(StatusEnum.PROCESSING),
				totalAmount: 200.0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			"order-2"
		);

		await orderRepository.create(order1);
		await orderRepository.create(order2);

		const result = await sut.execute({
			id: "order-2",
			userId: "user-123",
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.order.props.name).toBe("Order 2");
			expect(result.value.order.props.totalAmount).toBe(200.0);
		}
	});
});
