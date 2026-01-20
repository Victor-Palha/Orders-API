import { Encrypter } from "@/domain/accounts/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
	encrypt(payload: Record<string, unknown>): string {
		return JSON.stringify(payload);
	}
}
