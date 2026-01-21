import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { DatabaseModule } from "@/infra/database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";
import { JwtAuthGuard } from "./auth.guard";
import { JWTStrategy } from "./jwt-strategy";

@Module({
	imports: [
		PassportModule,
		DatabaseModule,
		CryptographyModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			global: true,
			useFactory: (envService: EnvService) => {
				const privateKey = envService.get("JWT_PRIVATE_KEY");
				const publicKey = envService.get("JWT_PUBLIC_KEY");

				return {
					signOptions: { algorithm: "RS256" },
					privateKey: Buffer.from(privateKey, "base64"),
					publicKey: Buffer.from(publicKey, "base64"),
				};
			},
		}),
	],
	providers: [
		JWTStrategy,
		EnvService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule {}
