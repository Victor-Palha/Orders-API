import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponseScalar {
	@ApiProperty({
		description: "Número de páginas",
		example: 1,
	})
	pages: number;

	@ApiProperty({
		description: "Total de itens listados",
		example: 10,
	})
	totalItems: number;
}
