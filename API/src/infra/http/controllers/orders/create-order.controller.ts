import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DomainCode } from "@/core/errors/enums/domain-code";
import { CreateOrderUseCase } from "@/domain/orders/application/use-cases/create-order-use-case";
import { CurrentUser } from "@/infra/configs/auth/current-user.decorator";
import { type JwtPayload } from "@/infra/configs/auth/jwt-strategy";
import { ErrorResponseScalar } from "../../documentation/error-response-scalar";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateOrderBodyDto, createOrderBodySchema } from "./dtos/create-order.dto";
import { OrderPresenter, OrderResponseScalar } from "./presenters/order-presenter";

@ApiTags("Orders")
@Controller("orders")
export class CreateOrderController {
	private readonly logger = new Logger(CreateOrderController.name);

	constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

	@Post()
	@ApiOperation({ summary: "Cria um novo pedido" })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Pedido criado com sucesso.",
		type: OrderResponseScalar,
	})
	@ErrorResponseScalar({
		description: "Dados inválidos fornecidos.",
		status: HttpStatus.BAD_REQUEST,
		error: DomainCode.BAD_REQUEST_ERROR,
		message: "Os dados fornecidos na requisição são inválidos.",
	})
	@ErrorResponseScalar({
		description: "Usuário não encontrado.",
		status: HttpStatus.NOT_FOUND,
		error: DomainCode.RESOURCE_NOT_FOUND_ERROR,
		message: "O usuário não foi encontrado no sistema.",
	})
	@ErroTokenScalar()
	public async execute(
		@Body(new ZodValidationPipe(createOrderBodySchema)) body: CreateOrderBodyDto,
		@CurrentUser() user: JwtPayload
	) {
		this.logger.log(`Criando pedido para usuário: ${user.sub}`);

		const result = await this.createOrderUseCase.execute({
			userId: user.sub,
			items: body.items,
		});

		if (result.success()) {
			return OrderPresenter.toHttp(result.value.order);
		}

		this.logger.error("Erro ao criar pedido", result.value.name);
		return result;
	}
}
