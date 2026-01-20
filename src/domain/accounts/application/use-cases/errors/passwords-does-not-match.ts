import { DomainError } from "@/core/errors/domain-error";
import { ErrorCode } from "./enums/error-code";

export class PasswordsDoesNotMatch extends DomainError {
	constructor(message?: string, code?: string) {
		super(message ?? "Passwords does not match", code ?? ErrorCode.PASSWORDS_DOES_NOT_MATCH_ERROR);
	}
}
