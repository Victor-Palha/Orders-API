import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./infra/configs/auth/auth.module";
import { CryptographyModule } from "./infra/configs/cryptography/cryptography.module";
import { envSchema } from "./infra/configs/env";
import { EnvModule } from "./infra/configs/env/env.module";
import { DatabaseModule } from "./infra/database/database.module";
import { HttpModule } from "./infra/http/http.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: env => envSchema.parse(env),
			isGlobal: true,
		}),
		DatabaseModule,
		HttpModule,
		EnvModule,
		CryptographyModule,
		AuthModule,
	],
})
export class AppModule {}
