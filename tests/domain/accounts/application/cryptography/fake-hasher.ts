import { Hasher } from "@/domain/accounts/application/cryptography/hasher";

export class FakeHasher implements Hasher {
	async hash(plainText: string): Promise<string> {
		return plainText.concat("-hasher");
	}

	async compare(plainText: string, hash: string) {
		return plainText.concat("-hasher") === hash;
	}
}
