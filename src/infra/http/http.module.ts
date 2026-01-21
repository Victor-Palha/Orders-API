import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CreateUserUseCase } from "@/domain/accounts/application/use-cases/create-user-use-case";
import { AuthModule } from "../configs/auth/auth.module";
import { CryptographyModule } from "../configs/cryptography/cryptography.module";
import { EnvModule } from "../configs/env/env.module";
import { DatabaseModule } from "../database/database.module";
import { CreateUserController } from "./controllers/accounts/create-user.controller";
import { EitherInterceptor } from "./interceptors/either-interceptor";

@Module({
	imports: [EnvModule, CryptographyModule, DatabaseModule, AuthModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: EitherInterceptor,
		},
		CreateUserUseCase,
	],
	controllers: [CreateUserController],
})
export class HttpModule {}
