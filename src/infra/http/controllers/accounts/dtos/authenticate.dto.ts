import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const authenticateBodySchema = z.object({
	email: z.email("Email inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

export class AuthenticateBodyDto implements AuthenticateBodySchema {
	@ApiProperty({
		description: "Email do usuário",
		example: "joao.silva@example.com",
	})
	email: string;

	@ApiProperty({
		description: "Senha do usuário",
		example: "senha@Segura123",
	})
	password: string;
}
