import { Injectable } from "@nestjs/common";
import { Either, failure, success } from "@/core/either";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidEmailError } from "@/domain/accounts/application/use-cases/errors/invalid-email-error";
import { UserEntity } from "../../enterprise/entities/user-entity";
import { Email } from "../../enterprise/entities/value-object/email";
import { Password } from "../../enterprise/entities/value-object/password";
import { Hasher } from "../cryptography/hasher";
import { UserRepository } from "../repositories/user-repository";
import { InvalidPasswordError } from "./errors/invalid-password-error";

interface CreateUserUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

type CreateUserUseCaseResponse = Either<
	ResourceNotFoundError | ResourceAlreadyExistsError | InvalidEmailError | InvalidPasswordError,
	{
		user: UserEntity;
	}
>;

@Injectable()
export class CreateUserUseCase {
	constructor(
		private userRepository: UserRepository,
		private hasher: Hasher
	) {}

	public async execute({
		email,
		name,
		password,
	}: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
		const userWithSameEmail = await this.userRepository.findByEmail(email);
		if (userWithSameEmail) {
			return failure(new ResourceAlreadyExistsError(email));
		}

		const emailVO = Email.createFromText(email);
		if (emailVO.failure()) {
			return failure(new InvalidEmailError(email));
		}

		const passwordVO = Password.createFromText(password);
		if (passwordVO.failure()) {
			return failure(new InvalidPasswordError(password));
		}

		const user = UserEntity.create({
			email: emailVO.value,
			name,
			password: passwordVO.value,
		});

		const passwordHash = await this.hasher.hash(passwordVO.value.value);
		user.props.passwordHash = passwordHash;

		await this.userRepository.create(user);

		return success({ user });
	}
}
