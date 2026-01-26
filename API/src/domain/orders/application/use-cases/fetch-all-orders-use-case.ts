import { Injectable } from "@nestjs/common";
import { Either, success } from "@/core/either";
import { OrderEntity } from "../../enterprise/order-entity";
import { type ListAllOrdersParams, OrderRepository } from "../repositories/order-repository";

interface FetchAllOrdersUseCaseRequest {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}

type FetchAllOrdersUseCaseResponse = Either<
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
export class FetchAllOrdersUseCase {
    constructor(private orderRepository: OrderRepository) { }

    public async execute({
        status,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "DESC",
    }: FetchAllOrdersUseCaseRequest): Promise<FetchAllOrdersUseCaseResponse> {
        const params: ListAllOrdersParams = {
            status,
            page,
            limit,
            sortBy,
            sortOrder,
        };

        const result = await this.orderRepository.listAllOrders(params);

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
