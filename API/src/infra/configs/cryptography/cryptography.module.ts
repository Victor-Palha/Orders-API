import { Module } from "@nestjs/common";
import { Encrypter } from "@/domain/accounts/application/cryptography/encrypter";
import { Hasher } from "@/domain/accounts/application/cryptography/hasher";
import { EnvModule } from "../env/env.module";
import { EncrypterService } from "./encrypter.service";
import { HasherService } from "./hasher.service";

@Module({
	imports: [EnvModule],
	providers: [
		{
			provide: Hasher,
			useClass: HasherService,
		},
		{
			provide: Encrypter,
			useClass: EncrypterService,
		},
	],
	exports: [Hasher, Encrypter],
})
export class CryptographyModule {}
