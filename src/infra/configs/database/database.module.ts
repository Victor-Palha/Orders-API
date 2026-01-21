import { Module } from "@nestjs/common";
import { UserRepository } from "@/domain/accounts/application/repositories/user-repository";
import { EnvModule } from "../env/env.module";
import { KnexService } from "./knex/knex.service";
import { KnexUserRepository } from "./repositories/knex-user-repository";

@Module({
	imports: [EnvModule],
	providers: [
		KnexService,
		{
			provide: UserRepository,
			useClass: KnexUserRepository,
		},
	],
	exports: [UserRepository],
})
export class DatabaseModule {}
