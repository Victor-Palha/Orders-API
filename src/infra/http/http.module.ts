import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthenticateUserUseCase } from "@/domain/accounts/application/use-cases/authenticate-user-use-case";
import { CreateUserUseCase } from "@/domain/accounts/application/use-cases/create-user-use-case";
import { FindUserByIdUseCase } from "@/domain/accounts/application/use-cases/find-user-by-id-use-case";
import { AuthModule } from "../configs/auth/auth.module";
import { CryptographyModule } from "../configs/cryptography/cryptography.module";
import { EnvModule } from "../configs/env/env.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/accounts/authenticate.controller";
import { CreateUserController } from "./controllers/accounts/create-user.controller";
import { UserProfileController } from "./controllers/accounts/user-profile.controller";
import { EitherInterceptor } from "./interceptors/either-interceptor";

@Module({
	imports: [EnvModule, CryptographyModule, DatabaseModule, AuthModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: EitherInterceptor,
		},
		CreateUserUseCase,
		AuthenticateUserUseCase,
		FindUserByIdUseCase,
	],
	controllers: [CreateUserController, AuthenticateController, UserProfileController],
})
export class HttpModule {}
