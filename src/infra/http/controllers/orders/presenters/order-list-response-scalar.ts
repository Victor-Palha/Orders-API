import { ApiProperty } from "@nestjs/swagger";
import { OrderResponseScalar } from "./order-presenter";

class PaginationMeta {
	@ApiProperty({ example: 50 })
	total: number;

	@ApiProperty({ example: 1 })
	page: number;

	@ApiProperty({ example: 10 })
	limit: number;

	@ApiProperty({ example: 5 })
	totalPages: number;
}

export class OrderListResponseScalar {
	@ApiProperty({ type: [OrderResponseScalar] })
	data: OrderResponseScalar[];

	@ApiProperty({ type: PaginationMeta })
	meta: PaginationMeta;
}
