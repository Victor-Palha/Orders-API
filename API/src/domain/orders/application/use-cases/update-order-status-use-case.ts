import { Injectable } from "@nestjs/common";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrderRepository } from "../repositories/order-repository";
import { Status } from "../../enterprise/value-object/status";
import { InvalidStatusError } from "./errors/invalid-status-error";

interface UpdateOrderStatusUseCaseRequest {
    orderId: string;
    status: string;
    processedAt: string;
}

type UpdateOrderStatusUseCaseResponse = Either<
    ResourceNotFoundError | InvalidStatusError,
    {
        success: boolean;
    }
>;

@Injectable()
export class UpdateOrderStatusUseCase {
    constructor(private orderRepository: OrderRepository) { }

    public async execute({
        orderId,
        status: statusText,
        processedAt,
    }: UpdateOrderStatusUseCaseRequest): Promise<UpdateOrderStatusUseCaseResponse> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            return failure(new ResourceNotFoundError("Order"));
        }

        const status = Status.createFromText(statusText);
        if (status.failure()) {
            return failure(status.value);
        }

        order.props.status = status.value;
        order.props.updatedAt = new Date();
        order.props.processedAt = new Date(processedAt);

        await this.orderRepository.update(order);

        return success({
            success: true,
        });
    }
}
