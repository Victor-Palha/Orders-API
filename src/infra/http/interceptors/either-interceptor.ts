import {
	BadRequestException,
	CallHandler,
	ConflictException,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Either, Failure } from "@/core/either";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidEmailError } from "@/domain/accounts/application/use-cases/errors/invalid-email-error";
import { InvalidPasswordError } from "@/domain/accounts/application/use-cases/errors/invalid-password-error";
import { PasswordsDoesNotMatch } from "@/domain/accounts/application/use-cases/errors/passwords-does-not-match";
import { WrongCredentialsError } from "@/domain/accounts/application/use-cases/errors/wrong-credentials-error";

@Injectable()
export class EitherInterceptor implements NestInterceptor {
	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((result: Either<Error, unknown> | any) => {
				if (result instanceof Failure && result.failure()) {
					const error = result.value;
					const errorClassName = error.constructor.name;

					if ([InvalidEmailError.name, InvalidPasswordError.name].includes(errorClassName)) {
						throw new BadRequestException(error.message, error.code);
					}

					if ([ResourceAlreadyExistsError.name].includes(errorClassName)) {
						throw new ConflictException(error.message, error.code);
					}

					if ([WrongCredentialsError.name, PasswordsDoesNotMatch.name].includes(errorClassName)) {
						throw new UnauthorizedException(error.message, error.code);
					}

					if ([ResourceNotFoundError.name].includes(errorClassName)) {
						throw new NotFoundException(error.message, error.code);
					}

					// fallback genérico
					throw new InternalServerErrorException(
						error.message || "Unexpected error occurred",
						error.code
					);
				}
				return result;
			})
		);
	}
}
