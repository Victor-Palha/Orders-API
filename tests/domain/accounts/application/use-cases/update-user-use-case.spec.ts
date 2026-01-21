import { beforeEach, describe, expect, it } from "vitest";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateUserUseCase } from "@/domain/accounts/application/use-cases/update-user-use-case";
import { userFixture } from "@/support/fixtures/user-fixture";
import { InMemoryUserRepository } from "../repositories/in-memory-user-repository";

describe("Upadate User Use Case", () => {
	let userRepository: InMemoryUserRepository;
	let sut: UpdateUserUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new UpdateUserUseCase(userRepository);
	});

	it("should receive error if user does not exist", async () => {
		const result = await sut.execute({
			id: "unknown-id",
			email: "test@dev.com",
			name: "Zepelin",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should receive error when user with same e-mail already exists", async () => {
		const user = userFixture({ email: "johndoe@dev.com" });
		userRepository.create(user);
		const userToBeUpdated = userFixture({ email: "janedoe@dev.com" });
		userRepository.create(userToBeUpdated);
		const result = await sut.execute({
			id: userToBeUpdated.id.toValue(),
			email: "johndoe@dev.com",
			name: "User 2",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError);
	});

	it("should update user", async () => {
		const user = userFixture({ email: "johndoe@dev.com" });
		userRepository.create(user);
		const data = {
			id: user.id.toValue(),
			email: "john@dev.com",
			name: "John Doe",
		};

		const result = await sut.execute(data);

		expect(result.success()).toBe(true);
		expect(userRepository.users).toHaveLength(1);

		if (result.failure()) return;

		expect(result.value.user.id.toValue()).toBeDefined();
		expect(result.value.user.props.email.value).toBe(data.email);
		expect(result.value.user.props.name).toBe(data.name);
	});
});
