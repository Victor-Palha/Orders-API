import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const createUserBodySchema = z.object({
	name: z
		.string()
		.min(3, "Nome precisa ser fornecido")
		.max(100, "Nome pode ter no máximo 100 caracteres"),
	email: z.email("Email inválido"),
	password: z
		.string()
		.min(8, "Senha precisa ter no mínimo 8 caracteres")
		.max(50, "Senha pode ter no máximo 50 caracteres"),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

export class CreateUserBodyDto implements CreateUserBodySchema {
	@ApiProperty({
		description: "Nome do usuário",
		example: "João da Silva",
		minLength: 3,
		maxLength: 100,
	})
	name: string;

	@ApiProperty({
		description: "Email do usuário",
		example: "joao.silva@example.com",
	})
	email: string;

	@ApiProperty({
		description: "Senha do usuário",
		example: "senha@Segura123",
		minLength: 8,
		maxLength: 50,
	})
	password: string;
}
