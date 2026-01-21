import { DomainError } from "@/core/errors/domain-error";
import { DomainCode } from "./enums/domain-code";

export class InvalidStatusError extends DomainError {
	constructor(status: string, code?: string) {
		super(`Invalid ${status}`, code ?? DomainCode.INVALID_STATUS_ERROR);
	}
}
