import { DomainError } from "./domain-error";
import { DomainCode } from "./enums/domain-code";

export class ResourceNotFoundError extends DomainError {
	constructor(resouce: string, code?: string) {
		super(`${resouce} não encontrado!`, code ?? DomainCode.RESOURCE_NOT_FOUND_ERROR);
	}
}
