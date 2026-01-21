import { Injectable } from "@nestjs/common";
import { Either, success } from "@/core/either";
import { OrderEntity } from "../../enterprise/order-entity";
import { type ListOrdersParams, OrderRepository } from "../repositories/order-repository";

interface ListOrdersUseCaseRequest {
	userId: string;
	status?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
}

type ListOrdersUseCaseResponse = Either<
	never,
	{
		orders: OrderEntity[];
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}
>;

@Injectable()
export class ListOrdersUseCase {
	constructor(private orderRepository: OrderRepository) {}

	public async execute({
		userId,
		status,
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = "DESC",
	}: ListOrdersUseCaseRequest): Promise<ListOrdersUseCaseResponse> {
		const params: ListOrdersParams = {
			userId,
			status,
			page,
			limit,
			sortBy,
			sortOrder,
		};

		const result = await this.orderRepository.listOrders(params);

		return success({
			orders: result.orders,
			meta: {
				total: result.total,
				page: result.page,
				limit: result.limit,
				totalPages: result.totalPages,
			},
		});
	}
}
