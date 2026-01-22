import { Either, failure, success } from "@/core/either";
import { ValueObject } from "@/core/entities/value-object";
import { InvalidPasswordError } from "@/domain/accounts/application/use-cases/errors/invalid-password-error";

export interface PasswordProps {
	password: string;
}

export class Password extends ValueObject<PasswordProps> {
	get value() {
		return this.props.password;
	}

	static create(password: string) {
		return new Password({ password });
	}

	static validate(password: string): boolean {
		if (!password || password.trim().length < 6) {
			return false;
		}

		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSymbol = /[\W_]/.test(password);

		return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
	}

	static createFromText(password: string): Either<InvalidPasswordError, Password> {
		if (!Password.validate(password)) {
			return failure(new InvalidPasswordError(password));
		}

		const passwordCreated = new Password({ password });

		return success(passwordCreated);
	}
}
