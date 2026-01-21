import { DomainError } from "@/core/errors/domain-error";
import { ErrorCode } from "./enums/error-code";

export class InvalidPasswordError extends DomainError {
	constructor(password: string, code?: string) {
		super(`Invalid ${password}`, code ?? ErrorCode.INVALID_PASSWORD_ERROR);
	}
}
