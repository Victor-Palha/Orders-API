import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { OrderCreatedEvent } from "./events/order-created-event";
import { Status } from "./value-object/status";

export type OrderProps = {
	name: string;
	userId: UniqueEntityID;
	status: Status;
	totalAmount: number;
	createdAt: Date;
	updatedAt: Date;
	processedAt?: Date;
};

export class OrderEntity extends AggregateRoot<OrderProps> {
	static create(props: Optional<OrderProps, "createdAt" | "updatedAt">, id?: string) {
		const order = new OrderEntity(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			new UniqueEntityID(id)
		);

		const isNew = !id;

		if (isNew) {
			order.addDomainEvent(new OrderCreatedEvent(order));
		}

		return order;
	}
}
