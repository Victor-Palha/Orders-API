import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthenticateUserUseCase } from "@/domain/accounts/application/use-cases/authenticate-user-use-case";
import { CreateUserUseCase } from "@/domain/accounts/application/use-cases/create-user-use-case";
import { FindUserByIdUseCase } from "@/domain/accounts/application/use-cases/find-user-by-id-use-case";
import { CreateOrderUseCase } from "@/domain/orders/application/use-cases/create-order-use-case";
import { FindOrderByIdUseCase } from "@/domain/orders/application/use-cases/find-order-by-id-use-case";
import { ListOrdersUseCase } from "@/domain/orders/application/use-cases/list-orders-use-case";
import { AuthModule } from "../configs/auth/auth.module";
import { CryptographyModule } from "../configs/cryptography/cryptography.module";
import { EnvModule } from "../configs/env/env.module";
import { SqsModule } from "../configs/sqs/sqs.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/accounts/authenticate.controller";
import { CreateUserController } from "./controllers/accounts/create-user.controller";
import { UserProfileController } from "./controllers/accounts/user-profile.controller";
import { CreateOrderController } from "./controllers/orders/create-order.controller";
import { FindOrderByIdController } from "./controllers/orders/find-order-by-id.controller";
import { ListOrdersController } from "./controllers/orders/list-orders.controller";
import { EitherInterceptor } from "./interceptors/either-interceptor";
import { FetchAllOrdersController } from "./controllers/orders/fetch-all-orders.controller";
import { FetchAllOrdersUseCase } from "@/domain/orders/application/use-cases/fetch-all-orders-use-case";

@Module({
	imports: [EnvModule, CryptographyModule, DatabaseModule, AuthModule, SqsModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: EitherInterceptor,
		},
		CreateUserUseCase,
		AuthenticateUserUseCase,
		FindUserByIdUseCase,
		CreateOrderUseCase,
		FindOrderByIdUseCase,
		ListOrdersUseCase,
		FetchAllOrdersUseCase
	],
	controllers: [
		CreateUserController,
		AuthenticateController,
		UserProfileController,
		CreateOrderController,
		FetchAllOrdersController,
		FindOrderByIdController,
		ListOrdersController,
	],
})
export class HttpModule { }
