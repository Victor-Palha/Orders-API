import { EntityBase } from "@/core/entities/entity-base";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type OrderItemProps = {
	orderId: UniqueEntityID;
	productId: number;
	productName: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	createdAt: Date;
	updatedAt: Date;
};

export class OrderItemEntity extends EntityBase<OrderItemProps> {
	static create(
		props: Optional<OrderItemProps, "createdAt" | "updatedAt" | "totalPrice">,
		id?: string
	) {
		const totalPrice = props.totalPrice ?? props.quantity * props.unitPrice;

		const orderItem = new OrderItemEntity(
			{
				...props,
				totalPrice,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			new UniqueEntityID(id)
		);

		return orderItem;
	}
}
