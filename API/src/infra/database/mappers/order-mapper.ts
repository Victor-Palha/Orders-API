import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { Status } from "@/domain/orders/enterprise/value-object/status";

export interface OrderRow {
	id: string;
	name: string;
	user_id: string;
	status: string;
	total_amount: number;
	processed_at: Date | null;
	created_at: Date;
	updated_at: Date;
}

export abstract class OrderMapper {
	static toEntity(row: OrderRow): OrderEntity {
		const statusResult = Status.createFromText(row.status);

		if (statusResult.failure()) {
			throw new Error(`Invalid status: ${row.status}`);
		}

		return OrderEntity.create(
			{
				name: row.name,
				userId: new UniqueEntityID(row.user_id),
				status: statusResult.value,
				totalAmount: row.total_amount,
				processedAt: row.processed_at ?? undefined,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			},
			row.id
		);
	}

	static toRow(order: OrderEntity): OrderRow {
		return {
			id: order.id.toValue(),
			name: order.props.name,
			user_id: order.props.userId.toValue(),
			status: order.props.status.value,
			total_amount: order.props.totalAmount,
			processed_at: order.props.processedAt ?? null,
			created_at: order.props.createdAt ?? new Date(),
			updated_at: order.props.updatedAt ?? new Date(),
		};
	}
}
