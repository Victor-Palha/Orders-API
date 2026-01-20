import { DomainError } from "@/core/errors/domain-error";
import { ErrorCode } from "./enums/error-code";

export class InvalidEmailError extends DomainError {
	constructor(email: string, code?: string) {
		super(`Invalid ${email} format`, code ?? ErrorCode.INVALID_EMAIL_ERROR);
	}
}
