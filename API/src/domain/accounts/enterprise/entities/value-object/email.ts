import { Either, failure, success } from "@/core/either";
import { ValueObject } from "@/core/entities/value-object";
import { InvalidEmailError } from "@/domain/accounts/application/use-cases/errors/invalid-email-error";

interface EmailProps {
	email: string;
}

export class Email extends ValueObject<EmailProps> {
	get value(): string {
		return this.props.email;
	}

	static create(email: string) {
		return new Email({ email });
	}

	static validate(email: string): boolean {
		if (!email || email.trim().length > 255) {
			return false;
		}

		const regex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!regex.test(email)) {
			return false;
		}

		return true;
	}

	static format(email: string) {
		return email.trim().toLowerCase();
	}

	static createFromText(email: string): Either<InvalidEmailError, Email> {
		if (!Email.validate(email)) {
			return failure(new InvalidEmailError(email));
		}

		const formattedEmail = Email.format(email);

		return success(new Email({ email: formattedEmail }));
	}
}
