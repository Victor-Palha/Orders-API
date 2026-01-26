import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FetchAllOrdersUseCase } from "@/domain/orders/application/use-cases/fetch-all-orders-use-case";
import { ErroTokenScalar } from "../../documentation/error-token-scalar";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FetchAllOrdersQueryDto, fetchAllOrdersQuerySchema } from "./dtos/fetch-all-orders.dto";
import { OrderListResponseScalar } from "./presenters/order-list-response-scalar";
import { OrderPresenter } from "./presenters/order-presenter";

@ApiTags("Orders")
@Controller("orders")
export class FetchAllOrdersController {
    private readonly logger = new Logger(FetchAllOrdersController.name);

    constructor(
        private readonly fetchAllOrdersUseCase: FetchAllOrdersUseCase
    ) { }

    @Get("/all")
    @ApiOperation({ summary: "Lista todos os pedidos de usuários" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Pedidos listados com sucesso.",
        type: OrderListResponseScalar,
    })
    @ErroTokenScalar()
    public async execute(
        @Query(new ZodValidationPipe(fetchAllOrdersQuerySchema)) query: FetchAllOrdersQueryDto
    ) {
        this.logger.log("Listando todos os pedidos do sistema");
        console.log("FetchAllOrdersController: execute called with query:", query);

        const result = await this.fetchAllOrdersUseCase.execute({
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

        this.logger.error("Erro ao listar todos os pedidos");
        return result;
    }
}