import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserEntity } from "../../enterprise/entities/user-entity";
import { UserRepository } from "../repositories/user-repository";

interface FindUserByIdUseCaseRequest {
	id: string;
}

type FindUserByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		user: UserEntity;
	}
>;

export class FindUserByIdUseCase {
	private readonly userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	public async execute({ id }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			return failure(new ResourceNotFoundError(id));
		}

		return success({
			user,
		});
	}
}
