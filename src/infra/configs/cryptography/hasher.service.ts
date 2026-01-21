import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { Hasher } from "@/domain/accounts/application/cryptography/hasher";
import { EnvService } from "../env/env.service";

@Injectable()
export class HasherService implements Hasher {
	constructor(private readonly envService: EnvService) {}
	public async hash(plainText: string): Promise<string> {
		const salt = this.envService.get("HASHER_SALT");
		return await hash(plainText, salt);
	}

	public async compare(plainText: string, hash: string): Promise<boolean> {
		return await compare(plainText, hash);
	}
}
