import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const fetchAllOrdersQuerySchema = z.object({
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: z.string().optional().default("created_at"),
    sortOrder: z.enum(["ASC", "DESC"]).optional().default("DESC"),
});

type FetchAllOrdersQuerySchema = z.infer<typeof fetchAllOrdersQuerySchema>;

export class FetchAllOrdersQueryDto implements FetchAllOrdersQuerySchema {
    @ApiProperty({
        description: "Filtrar por status",
        example: "PENDING",
        required: false,
        enum: ["PENDING", "PROCESSING", "PROCESSED", "COMPLETED", "CANCELLED"],
    })
    status?: string;

    @ApiProperty({
        description: "Número da página",
        example: 1,
        required: false,
        default: 1,
    })
    page: number;

    @ApiProperty({
        description: "Itens por página",
        example: 10,
        required: false,
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    limit: number;

    @ApiProperty({
        description: "Campo para ordenação",
        example: "created_at",
        required: false,
        default: "created_at",
    })
    sortBy: string;

    @ApiProperty({
        description: "Ordem de ordenação",
        example: "DESC",
        required: false,
        default: "DESC",
        enum: ["ASC", "DESC"],
    })
    sortOrder: "ASC" | "DESC";
}
