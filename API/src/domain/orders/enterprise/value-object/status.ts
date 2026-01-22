import { Either, failure, success } from "@/core/either";
import { ValueObject } from "@/core/entities/value-object";
import { InvalidStatusError } from "../../application/use-cases/errors/invalid-status-error";
import { StatusEnum } from "../enums/status.enum";

export interface StatusProps {
	status: StatusEnum;
}

export class Status extends ValueObject<StatusProps> {
	get value(): StatusEnum {
		return this.props.status;
	}

	static create(status: StatusEnum): Status {
		return new Status({ status });
	}

	static validate(status: unknown): status is StatusEnum {
		return Object.values(StatusEnum).includes(status as StatusEnum);
	}

	static createFromText(value: string): Either<InvalidStatusError, Status> {
		if (!Status.validate(value)) {
			return failure(new InvalidStatusError(value));
		}

		return success(new Status({ status: value }));
	}
}
