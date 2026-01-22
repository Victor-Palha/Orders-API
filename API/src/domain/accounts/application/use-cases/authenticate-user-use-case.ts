import { Injectable } from "@nestjs/common";
import { Either, failure, success } from "@/core/either";
import { UserEntity } from "../../enterprise/entities/user-entity";
import { Encrypter } from "../cryptography/encrypter";
import { Hasher } from "../cryptography/hasher";
import { UserRepository } from "../repositories/user-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface AuthenticateUserUseCaseRequest {
	email: string;
	password: string;
}

type AuthenticateUserUseCaseResponse = Either<
	WrongCredentialsError,
	{
		user: UserEntity;
		token: string;
	}
>;

@Injectable()
export class AuthenticateUserUseCase {
	private readonly userRepository: UserRepository;
	private readonly hasher: Hasher;
	private readonly encryper: Encrypter;

	constructor(userRepository: UserRepository, hasher: Hasher, encryper: Encrypter) {
		this.userRepository = userRepository;
		this.hasher = hasher;
		this.encryper = encryper;
	}

	public async execute({
		email,
		password,
	}: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			return failure(new WrongCredentialsError());
		}
		const passwordMatches = await this.hasher.compare(password, user.props.password.value);

		if (!passwordMatches) {
			return failure(new WrongCredentialsError());
		}
		const token = this.encryper.encrypt({ sub: user.id.toValue() }, "MAIN");

		return success({
			user,
			token,
		});
	}
}
