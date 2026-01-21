import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ListOrdersUseCase } from "@/domain/orders/application/use-cases/list-orders-use-case";
import { CurrentUser } from "@/infra/configs/auth/current-user.decorator";
import { type JwtPayload } from "@/infra/configs/auth/jwt-strategy";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ListOrdersQueryDto, listOrdersQuerySchema } from "./dtos/list-orders.dto";
import { OrderListResponseScalar } from "./presenters/order-list-response-scalar";
import { OrderPresenter } from "./presenters/order-presenter";

@ApiTags("Orders")
@Controller("orders")
export class ListOrdersController {
	private readonly logger = new Logger(ListOrdersController.name);

	constructor(private readonly listOrdersUseCase: ListOrdersUseCase) {}

	@Get()
	@ApiOperation({ summary: "Lista todos os pedidos do usuário autenticado" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Pedidos listados com sucesso.",
		type: OrderListResponseScalar,
	})
	@ErroTokenScalar()
	public async execute(
		@Query(new ZodValidationPipe(listOrdersQuerySchema)) query: ListOrdersQueryDto,
		@CurrentUser() user: JwtPayload
	) {
		this.logger.log(`Listando pedidos para usuário: ${user.sub}`);
		console.log("ListOrdersController: execute called with query:", query, "and user:", user);
		const result = await this.listOrdersUseCase.execute({
			userId: user.sub,
			status: query.status,
			page: query.page,
			limit: query.limit,
			sortBy: query.sortBy,
			sortOrder: query.sortOrder,
		});

		if (result.success()) {
			return {
				data: OrderPresenter.toHttpList(result.value.orders),
				meta: result.value.meta,
			};
		}

		this.logger.error("Erro ao listar pedidos");
		return result;
	}
}
