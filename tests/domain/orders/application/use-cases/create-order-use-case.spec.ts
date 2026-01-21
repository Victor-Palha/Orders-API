import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemoryUserRepository } from "@/domain/accounts/application/repositories/in-memory-user-repository";
import {
	CreateOrderUseCase,
	type OrderItemInput,
} from "@/domain/orders/application/use-cases/create-order-use-case";
import { StatusEnum } from "@/domain/orders/enterprise/enums/status.enum";
import { userFixture } from "@/support/fixtures/user-fixture";
import { InMemoryOrderItemRepository } from "../repositories/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "../repositories/in-memory-order-repository";

describe("Create Order Use Case", () => {
	let orderRepository: InMemoryOrderRepository;
	let userRepository: InMemoryUserRepository;
	let orderItemRepository: InMemoryOrderItemRepository;
	let sut: CreateOrderUseCase;

	beforeEach(() => {
		orderItemRepository = new InMemoryOrderItemRepository();
		orderRepository = new InMemoryOrderRepository(orderItemRepository);
		userRepository = new InMemoryUserRepository();

		sut = new CreateOrderUseCase(orderRepository, userRepository, orderItemRepository);
	});

	it("should be able to create a new order", async () => {
		const user = userFixture();
		await userRepository.create(user);

		const items: OrderItemInput[] = [
			{
				productId: 101,
				productName: "Mouse Gamer",
				quantity: 2,
				unitPrice: 149.99,
			},
			{
				productId: 102,
				productName: "Teclado Mecânico",
				quantity: 1,
				unitPrice: 450.0,
			},
		];

		const result = await sut.execute({
			name: "Test Order",
			userId: user.id.toValue(),
			items,
		});

		expect(result.success()).toBe(true);
		expect(result.value).toMatchObject({
			order: expect.objectContaining({
				props: expect.objectContaining({
					name: "Test Order",
					status: expect.objectContaining({
						value: StatusEnum.PENDING,
					}),
					totalAmount: 749.98,
				}),
			}),
		});
		expect(orderRepository.orders).toHaveLength(1);
	});

	it("Should not be able to create an order for a non-existing user", async () => {
		const items: OrderItemInput[] = [
			{
				productId: 101,
				productName: "Product 1",
				quantity: 3,
				unitPrice: 100.0,
			},
			{
				productId: 102,
				productName: "Product 2",
				quantity: 2,
				unitPrice: 50.5,
			},
		];

		const result = await sut.execute({
			name: "Order with invalid user",
			userId: "non-existing-user-id",
			items,
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(orderRepository.orders).toHaveLength(0);
	});

	it("should calculate total amount correctly", async () => {
		const user = userFixture();
		await userRepository.create(user);

		const items: OrderItemInput[] = [
			{
				productId: 101,
				productName: "Product 1",
				quantity: 3,
				unitPrice: 100.0,
			},
			{
				productId: 102,
				productName: "Product 2",
				quantity: 2,
				unitPrice: 50.5,
			},
		];

		const result = await sut.execute({
			name: "Order with calculated total",
			userId: user.id.toValue(),
			items,
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.order.props.totalAmount).toBe(401.0);
		}
	});

	it("should create order with PENDING status by default", async () => {
		const user = userFixture();
		await userRepository.create(user);

		const items: OrderItemInput[] = [
			{
				productId: 101,
				productName: "Test Product",
				quantity: 1,
				unitPrice: 99.99,
			},
		];

		const result = await sut.execute({
			name: "Pending Order",
			userId: user.id.toValue(),
			items,
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.order.props.status.value).toBe(StatusEnum.PENDING);
		}
	});

	it("should create order with createdAt and updatedAt timestamps", async () => {
		const user = userFixture();
		await userRepository.create(user);

		const items: OrderItemInput[] = [
			{
				productId: 101,
				productName: "Test Product",
				quantity: 1,
				unitPrice: 50.0,
			},
		];

		const result = await sut.execute({
			name: "Order with timestamps",
			userId: user.id.toValue(),
			items,
		});

		expect(result.success()).toBe(true);
		if (result.success()) {
			expect(result.value.order.props.createdAt).toBeInstanceOf(Date);
			expect(result.value.order.props.updatedAt).toBeInstanceOf(Date);
		}
	});
});
