import { Controller, Get, HttpStatus, Logger } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DomainCode } from "@/core/errors/enums/domain-code";
import { FindUserByIdUseCase } from "@/domain/accounts/application/use-cases/find-user-by-id-use-case";
import { CurrentUser } from "@/infra/configs/auth/current-user.decorator";
import { type JwtPayload } from "@/infra/configs/auth/jwt-strategy";
import { ErrorResponseScalar } from "../../documentation/error-response-scalar";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { UserPresenter } from "./presenters/user-presenter";
import { UserResponseScalar } from "./presenters/user-reponse-scalar";

@ApiTags("Accounts")
@Controller("/auth")
export class UserProfileController {
	private readonly logger = new Logger(UserProfileController.name);

	constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

	@Get("/me")
	@ApiOperation({ summary: "Retorna o perfil do usuário logado" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Perfil do usuário retornado com sucesso.",
		type: UserResponseScalar,
	})
	@ErrorResponseScalar({
		description: "Usuário não encontrado.",
		status: HttpStatus.NOT_FOUND,
		error: DomainCode.RESOURCE_NOT_FOUND_ERROR,
		message: "O usuário não foi encontrado no sistema.",
	})
	@ErroTokenScalar()
	public async execute(@CurrentUser() user: JwtPayload) {
		this.logger.log(`Buscando perfil do usuário: ${user.sub}`);

		const result = await this.findUserByIdUseCase.execute({
			id: user.sub,
		});

		if (result.success()) {
			return UserPresenter.toHttp(result.value.user);
		}

		this.logger.error("Erro ao buscar perfil do usuário", result.value.name);
		return result;
	}
}
