import { ApiProperty } from "@nestjs/swagger";
import { UserResponseScalar } from "./user-reponse-scalar";

export class AuthResponseScalar {
	@ApiProperty({
		description: "Dados do usuário autenticado",
		type: UserResponseScalar,
	})
	user: UserResponseScalar;

	@ApiProperty({
		description: "Token JWT de autenticação",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	token: string;
}
