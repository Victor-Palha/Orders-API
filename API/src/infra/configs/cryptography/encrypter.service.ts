import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Encrypter } from "@/domain/accounts/application/cryptography/encrypter";

@Injectable()
export class EncrypterService implements Encrypter {
	private readonly logger = new Logger(EncrypterService.name);
	constructor(private readonly jwt: JwtService) {}

	public encrypt(payload: Record<string, unknown>, type: "MAIN" | "REFRESH"): string {
		this.logger.log("EncrypterService encrypt called with payload:", payload);
		return this.jwt.sign(payload, {
			expiresIn: type === "MAIN" ? "15m" : "7d",
			issuer: "Orders-API",
		});
	}
}
