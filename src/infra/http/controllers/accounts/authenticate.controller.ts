import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DomainCode } from "@/core/errors/enums/domain-code";
import { AuthenticateUserUseCase } from "@/domain/accounts/application/use-cases/authenticate-user-use-case";
import { Public } from "@/infra/configs/auth/public.decorator";
import { ErrorResponseScalar } from "../../documentation/error-response-scalar";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { AuthenticateBodyDto, authenticateBodySchema } from "./dtos/authenticate.dto";
import { AuthResponseScalar } from "./presenters/auth-response-scalar";
import { UserPresenter } from "./presenters/user-presenter";

@ApiTags("Accounts")
@Controller("/auth")
@Public()
export class AuthenticateController {
	private readonly logger = new Logger(AuthenticateController.name);

	constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

	@Post("/login")
	@ApiOperation({ summary: "Autentica um usuário e retorna o token JWT" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Usuário autenticado com sucesso.",
		type: AuthResponseScalar,
	})
	@ErrorResponseScalar({
		description: "Credenciais inválidas.",
		status: HttpStatus.UNAUTHORIZED,
		error: DomainCode.BAD_REQUEST_ERROR,
		message: "Email ou senha incorretos.",
	})
	@ErrorResponseScalar({
		description: "Dados inválidos fornecidos.",
		status: HttpStatus.BAD_REQUEST,
		error: DomainCode.BAD_REQUEST_ERROR,
		message: "Os dados fornecidos na requisição são inválidos.",
	})
	@ErroTokenScalar()
	public async execute(
		@Body(new ZodValidationPipe(authenticateBodySchema)) body: AuthenticateBodyDto
	) {
		this.logger.log("Iniciando autenticação de usuário");

		const result = await this.authenticateUserUseCase.execute({
			email: body.email,
			password: body.password,
		});

		if (result.success()) {
			return {
				user: UserPresenter.toHttp(result.value.user),
				token: result.value.token,
			};
		}

		this.logger.error("Erro ao autenticar usuário", result.value.name);
		return result;
	}
}
