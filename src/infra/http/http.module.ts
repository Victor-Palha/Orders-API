import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "../configs/auth/auth.module";
import { CryptographyModule } from "../configs/cryptography/cryptography.module";
import { EnvModule } from "../configs/env/env.module";
import { DatabaseModule } from "../database/database.module";
import { EitherInterceptor } from "./interceptors/either-interceptor";

@Module({
	imports: [EnvModule, CryptographyModule, DatabaseModule, AuthModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: EitherInterceptor,
		},
	],
})
export class HttpModule {}
