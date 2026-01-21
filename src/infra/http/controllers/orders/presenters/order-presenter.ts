import { ApiProperty } from "@nestjs/swagger";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { OrderItemEntity } from "@/domain/orders/enterprise/order-item-entity";

class OrderItemResponseScalar {
	@ApiProperty({ example: "1" })
	id: string;

	@ApiProperty({ example: 101 })
	productId: number;

	@ApiProperty({ example: "Mouse Gamer" })
	productName: string;

	@ApiProperty({ example: 2 })
	quantity: number;

	@ApiProperty({ example: 149.99 })
	unitPrice: number;

	@ApiProperty({ example: 299.98 })
	totalPrice: number;
}

export class OrderResponseScalar {
	@ApiProperty({ example: "1" })
	id: string;

	@ApiProperty({ example: "Pedido #1" })
	name: string;

	@ApiProperty({ example: "1" })
	userId: string;

	@ApiProperty({ example: "PENDING" })
	status: string;

	@ApiProperty({ example: 299.99 })
	totalAmount: number;

	@ApiProperty({ example: "2024-01-20T10:00:00.000Z" })
	createdAt: Date;

	@ApiProperty({ example: "2024-01-20T10:00:00.000Z" })
	updatedAt: Date;

	@ApiProperty({ example: null, nullable: true })
	processedAt?: Date | null;

	@ApiProperty({ type: [OrderItemResponseScalar] })
	items: OrderItemResponseScalar[];
}

export class OrderPresenter {
	private static toHttpItem(item: OrderItemEntity): OrderItemResponseScalar {
		return {
			id: item.id.toValue(),
			productId: item.props.productId,
			productName: item.props.productName,
			quantity: item.props.quantity,
			unitPrice: item.props.unitPrice,
			totalPrice: item.props.totalPrice,
		};
	}

	public static toHttp(order: OrderEntity): OrderResponseScalar {
		return {
			id: order.id.toValue(),
			name: order.props.name,
			userId: order.props.userId.toValue(),
			status: order.props.status.value,
			totalAmount: order.props.totalAmount,
			createdAt: order.props.createdAt,
			updatedAt: order.props.updatedAt,
			processedAt: order.props.processedAt ?? null,
			items: order.props.items?.map(item => this.toHttpItem(item)) ?? [],
		};
	}

	public static toHttpList(orders: OrderEntity[]): OrderResponseScalar[] {
		return orders.map(order => this.toHttp(order));
	}
}
