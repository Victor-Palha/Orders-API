import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderItemEntity } from "@/domain/orders/enterprise/order-item-entity";

export interface OrderItemRow {
	id: string;
	order_id: string;
	product_id: number;
	product_name: string;
	quantity: number;
	unit_price: number;
	total_price: number;
	created_at: Date;
	updated_at: Date;
}

export abstract class OrderItemMapper {
	static toEntity(row: OrderItemRow): OrderItemEntity {
		return OrderItemEntity.create(
			{
				orderId: new UniqueEntityID(row.order_id),
				productId: row.product_id,
				productName: row.product_name,
				quantity: row.quantity,
				unitPrice: row.unit_price,
				totalPrice: row.total_price,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			},
			row.id
		);
	}

	static toRow(orderItem: OrderItemEntity): OrderItemRow {
		return {
			id: orderItem.id.toValue(),
			order_id: orderItem.props.orderId.toValue(),
			product_id: orderItem.props.productId,
			product_name: orderItem.props.productName,
			quantity: orderItem.props.quantity,
			unit_price: orderItem.props.unitPrice,
			total_price: orderItem.props.totalPrice,
			created_at: orderItem.props.createdAt ?? new Date(),
			updated_at: orderItem.props.updatedAt ?? new Date(),
		};
	}
}
