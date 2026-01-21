import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FindUserByIdUseCase } from "@/domain/accounts/application/use-cases/find-user-by-id-use-case";
import { UserEntity } from "@/domain/accounts/enterprise/entities/user-entity";
import { userFixture } from "@/support/fixtures/user-fixture";
import { InMemoryUserRepository } from "../repositories/in-memory-user-repository";

describe("Find User by Id Use Case", () => {
	let userRepository: InMemoryUserRepository;
	let sut: FindUserByIdUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new FindUserByIdUseCase(userRepository);
	});

	it("should receive error if user does not exist", async () => {
		const result = await sut.execute({
			id: "non-existing-id",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return user if user exists", async () => {
		const user = userFixture({ email: "johndoe@dev.com" });
		userRepository.create(user);

		const result = await sut.execute({
			id: user.id.toValue(),
		});

		if (result.failure()) return;

		expect(result.success()).toBe(true);
		expect(result.value.user).toBeInstanceOf(UserEntity);
		expect(result.value.user.id).toEqual(user.id);
	});
});
