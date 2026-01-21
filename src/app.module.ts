import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./infra/configs/database/database.module";
import { envSchema } from "./infra/configs/env";
import { EnvModule } from "./infra/configs/env/env.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: env => envSchema.parse(env),
			isGlobal: true,
		}),
		EnvModule,
		DatabaseModule,
	],
})
export class AppModule {}
