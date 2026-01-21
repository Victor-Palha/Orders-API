import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const orderItemSchema = z.object({
	productId: z.number().positive("Product ID deve ser um número positivo"),
	productName: z.string().min(1, "Nome do produto é obrigatório"),
	quantity: z.number().int().min(1, "Quantidade deve ser no mínimo 1"),
	unitPrice: z.number().min(0.01, "Preço unitário deve ser maior que 0"),
});

export const createOrderBodySchema = z.object({
	items: z.array(orderItemSchema).min(1, "Pedido deve conter pelo menos 1 item"),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;
type OrderItemSchema = z.infer<typeof orderItemSchema>;

class OrderItemDto implements OrderItemSchema {
	@ApiProperty({
		description: "ID do produto",
		example: 101,
	})
	productId: number;

	@ApiProperty({
		description: "Nome do produto",
		example: "Mouse Gamer",
	})
	productName: string;

	@ApiProperty({
		description: "Quantidade",
		example: 2,
		minimum: 1,
	})
	quantity: number;

	@ApiProperty({
		description: "Preço unitário",
		example: 149.99,
		minimum: 0.01,
	})
	unitPrice: number;
}

export class CreateOrderBodyDto implements CreateOrderBodySchema {
	@ApiProperty({
		description: "Itens do pedido",
		type: [OrderItemDto],
	})
	items: OrderItemDto[];
}
