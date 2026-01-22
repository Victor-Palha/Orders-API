import { Injectable } from "@nestjs/common";
import { Either, failure, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserRepository } from "@/domain/accounts/application/repositories/user-repository";
import { StatusEnum } from "../../enterprise/enums/status.enum";
import { OrderEntity } from "../../enterprise/order-entity";
import { OrderItemEntity } from "../../enterprise/order-item-entity";
import { Status } from "../../enterprise/value-object/status";
import { OrderItemRepository } from "../repositories/order-item-repository";
import { OrderRepository } from "../repositories/order-repository";
import { InvalidStatusError } from "./errors/invalid-status-error";

export interface OrderItemInput {
	productId: number;
	productName: string;
	quantity: number;
	unitPrice: number;
}

interface CreateOrderUseCaseRequest {
	userId: string;
	items: OrderItemInput[];
}

type CreateOrderUseCaseResponse = Either<
	InvalidStatusError | ResourceNotFoundError,
	{
		order: OrderEntity;
	}
>;

@Injectable()
export class CreateOrderUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private userRepository: UserRepository,
		private orderItemRepository: OrderItemRepository
	) { }

	public async execute({
		userId,
		items,
	}: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
		const userExists = await this.userRepository.findById(userId);
		if (!userExists) {
			return failure(new ResourceNotFoundError("User"));
		}

		const totalAmount = items.reduce((sum, item) => {
			return sum + item.quantity * item.unitPrice;
		}, 0);

		const status = Status.createFromText(StatusEnum.PENDING);
		if (status.failure()) {
			return failure(status.value);
		}
		const order = OrderEntity.create({
			name: `Pedido de ${userExists.props.name}`,
			userId: new UniqueEntityID(userId),
			status: status.value,
			totalAmount,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await this.orderRepository.create(order);

		const orderItems = items.map(item => {
			return OrderItemEntity.create({
				orderId: order.id,
				productId: item.productId,
				productName: item.productName,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
			});
		});

		await this.orderItemRepository.createMany(orderItems);
		order.items = orderItems;

		return success({
			order,
		});
	}
}
