import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseScalar } from "../../global-presenters/paginated-response-scalar";

export class UserResponseScalar {
	@ApiProperty({
		description: "ID do usuário",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	id: string;

	@ApiProperty({
		description: "Nome do usuário",
		example: "João Silva",
	})
	name: string;

	@ApiProperty({
		description: "Email do usuário",
		example: "joao.silva@example.com",
	})
	email: string;

	@ApiProperty({
		description: "Data de criação do usuário",
		example: "2023-10-05T14:48:00.000Z",
	})
	created_at: Date;

	@ApiProperty({
		description: "Data da última atualização do usuário",
		example: "2023-10-10T10:20:30.000Z",
	})
	updated_at: Date;
}

export class UserResponsePaginatedScalar extends PaginatedResponseScalar {
	@ApiProperty({
		description: "Usuários listados",
		type: [UserResponseScalar],
	})
	users: UserResponseScalar[];
}

export class UserResponseListScalar {
	@ApiProperty({
		description: "Lista de usuários",
		type: [UserResponseScalar],
	})
	users: UserResponseScalar[];
}
