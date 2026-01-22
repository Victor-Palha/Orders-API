import { Controller, Get, HttpStatus, Logger, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DomainCode } from "@/core/errors/enums/domain-code";
import { FindOrderByIdUseCase } from "@/domain/orders/application/use-cases/find-order-by-id-use-case";
import { CurrentUser } from "@/infra/configs/auth/current-user.decorator";
import { type JwtPayload } from "@/infra/configs/auth/jwt-strategy";
import { ErrorResponseScalar } from "../../documentation/error-response-scalar";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { OrderPresenter, OrderResponseScalar } from "./presenters/order-presenter";

@ApiTags("Orders")
@Controller("orders")
export class FindOrderByIdController {
	private readonly logger = new Logger(FindOrderByIdController.name);

	constructor(private readonly findOrderByIdUseCase: FindOrderByIdUseCase) {}

	@Get(":id")
	@ApiOperation({ summary: "Retorna detalhes de um pedido específico" })
	@ApiParam({
		name: "id",
		description: "ID do pedido",
		example: "79618eed-51b1-488f-93d3-d14e608cf106",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Pedido encontrado com sucesso.",
		type: OrderResponseScalar,
	})
	@ErrorResponseScalar({
		description: "Pedido não encontrado.",
		status: HttpStatus.NOT_FOUND,
		error: DomainCode.RESOURCE_NOT_FOUND_ERROR,
		message: "O pedido não foi encontrado ou não pertence ao usuário.",
	})
	@ErroTokenScalar()
	public async execute(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
		this.logger.log(`Buscando pedido ${id} para usuário: ${user.sub}`);

		const result = await this.findOrderByIdUseCase.execute({
			id,
			userId: user.sub,
		});

		if (result.success()) {
			return OrderPresenter.toHttp(result.value.order);
		}

		this.logger.error("Erro ao buscar pedido", result.value.name);
		return result;
	}
}
