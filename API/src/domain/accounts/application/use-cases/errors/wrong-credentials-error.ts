import { DomainError } from "@/core/errors/domain-error";
import { ErrorCode } from "./enums/error-code";

export class WrongCredentialsError extends DomainError {
	constructor(message?: string, code?: string) {
		super(message ?? "Credenciais inválidas!", code ?? ErrorCode.WRONG_CREDENTIALS_ERROR);
	}
}
