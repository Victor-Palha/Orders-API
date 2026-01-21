import { Either, failure, success } from "@/core/either";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserEntity } from "../../enterprise/entities/user-entity";
import { Email } from "../../enterprise/entities/value-object/email";
import { UserRepository } from "../repositories/user-repository";
import { InvalidEmailError } from "./errors/invalid-email-error";

interface UpdateUserUseCaseRequest {
	id: string;
	name: string;
	email: string;
}

type UpdateUserUseCaseResponse = Either<
	ResourceNotFoundError | ResourceAlreadyExistsError | InvalidEmailError,
	{
		user: UserEntity;
	}
>;

export class UpdateUserUseCase {
	private readonly userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	public async execute({
		id,
		name,
		email,
	}: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
		const userExists = await this.userRepository.findById(id);

		if (!userExists) {
			return failure(new ResourceNotFoundError(id));
		}
		const emailVO = Email.createFromText(email);

		if (emailVO.failure()) {
			return failure(new InvalidEmailError(email));
		}

		if (email !== userExists.props.email.value) {
			const emailError = await this.doesUserWithSameEmailExists(email);
			if (emailError) {
				return failure(new ResourceAlreadyExistsError("Email"));
			}
		}

		const userUpdated = UserEntity.create(
			{
				email: emailVO.value,
				name,
				password: userExists.props.password,
			},
			userExists.id.toValue()
		);

		await this.userRepository.update(userUpdated);

		return success({ user: userUpdated });
	}

	private async doesUserWithSameEmailExists(email: string): Promise<boolean> {
		const userWithSameEmail = await this.userRepository.findByEmail(email);
		if (userWithSameEmail) {
			return true;
		}
		return false;
	}
}
