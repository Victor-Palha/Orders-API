import { DomainError } from "./domain-error";
import { DomainCode } from "./enums/domain-code";

export class ResourceAlreadyExistsError extends DomainError {
	constructor(resouce: string, code?: string) {
		super(`${resouce} já existe!`, code ?? DomainCode.RESOURCE_ALREADY_EXISTS_ERROR);
	}
}
