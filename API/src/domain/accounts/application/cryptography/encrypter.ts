export abstract class Encrypter {
	abstract encrypt(payload: Record<string, unknown>, type: "MAIN" | "REFRESH"): string;
}
