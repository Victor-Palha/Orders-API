import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DomainCode } from "@/core/errors/enums/domain-code";
import { CreateUserUseCase } from "@/domain/accounts/application/use-cases/create-user-use-case";
import { Public } from "@/infra/configs/auth/public.decorator";
import { ErrorResponseScalar } from "../../documentation/error-response-scalar";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateUserBodyDto, createUserBodySchema } from "./dtos/create-user.dto";
import { UserPresenter } from "./presenters/user-presenter";
import { UserResponseScalar } from "./presenters/user-reponse-scalar";

@ApiTags("Accounts")
@Controller("accounts")
@Public()
export class CreateUserController {
	private readonly logger = new Logger(CreateUserController.name);

	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	@Post("/users")
	@ApiOperation({ summary: "Cria um novo usuário" })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Usuário criado com sucesso.",
		type: UserResponseScalar,
	})
	@ErrorResponseScalar({
		description: "Dados inválidos fornecidos.",
		status: HttpStatus.BAD_REQUEST,
		error: DomainCode.BAD_REQUEST_ERROR,
		message: "Os dados fornecidos na requisição são inválidos.",
	})
	@ErrorResponseScalar({
		status: HttpStatus.CONFLICT,
		description: "Conflito ao criar usuário.",
		error: DomainCode.RESOURCE_ALREADY_EXISTS_ERROR,
		message: "Já existe um recurso com os mesmos dados fornecidos.",
	})
	@ErroTokenScalar()
	public async execute(@Body(new ZodValidationPipe(createUserBodySchema)) body: CreateUserBodyDto) {
		this.logger.log("Iniciando criação de novo usuário");

		const result = await this.createUserUseCase.execute({
			name: body.name,
			email: body.email,
			password: body.password,
		});

		if (result.success()) {
			return UserPresenter.toHttp(result.value.user);
		}

		this.logger.error("Erro ao criar novo usuário", result.value.name);
		return result;
	}
}
