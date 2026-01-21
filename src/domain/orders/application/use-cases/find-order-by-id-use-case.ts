import { Injectable } from "@nestjs/common";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrderEntity } from "../../enterprise/order-entity";
import { OrderRepository } from "../repositories/order-repository";

interface FindOrderByIdUseCaseRequest {
	id: string;
	userId: string;
}

type FindOrderByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		order: OrderEntity;
	}
>;

@Injectable()
export class FindOrderByIdUseCase {
	constructor(private orderRepository: OrderRepository) {}

	public async execute({
		id,
		userId,
	}: FindOrderByIdUseCaseRequest): Promise<FindOrderByIdUseCaseResponse> {
		const order = await this.orderRepository.findByIdAndUserId(id, userId);

		if (!order) {
			return failure(new ResourceNotFoundError(id));
		}

		return success({
			order,
		});
	}
}
