import { Module } from "@nestjs/common";
import { UserRepository } from "@/domain/accounts/application/repositories/user-repository";
import { OrderItemRepository } from "@/domain/orders/application/repositories/order-item-repository";
import { OrderRepository } from "@/domain/orders/application/repositories/order-repository";
import { EnvModule } from "../env/env.module";
import { KnexService } from "./knex/knex.service";
import { KnexOrderItemRepository } from "./repositories/knex-order-item-repository";
import { KnexOrderRepository } from "./repositories/knex-order-repository";
import { KnexUserRepository } from "./repositories/knex-user-repository";

@Module({
	imports: [EnvModule],
	providers: [
		KnexService,
		KnexOrderItemRepository,
		{
			provide: UserRepository,
			useClass: KnexUserRepository,
		},
		{
			provide: OrderItemRepository,
			useClass: KnexOrderItemRepository,
		},
		{
			provide: OrderRepository,
			useClass: KnexOrderRepository,
		},
	],
	exports: [UserRepository, OrderRepository, OrderItemRepository],
})
export class DatabaseModule {}
