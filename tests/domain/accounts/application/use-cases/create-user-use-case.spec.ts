import { beforeEach, describe, expect, it } from "vitest";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { CreateUserUseCase } from "@/domain/accounts/application/use-cases/create-user-use-case";
import { userFixture } from "@/support/fixtures/user-fixture";
import { FakeHasher } from "../cryptography/fake-hasher";
import { InMemoryUserRepository } from "../repositories/in-memory-user-repository";

describe("Create User Use Case", () => {
	let userRepository: InMemoryUserRepository;
	let hasher: FakeHasher;
	let sut: CreateUserUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		hasher = new FakeHasher();
		sut = new CreateUserUseCase(userRepository, hasher);
	});

	it("should receive error request does not exist", async () => {
		const result = await sut.execute({
			email: "",
			name: "",
			password: "",
		});

		expect(result.failure()).toBe(true);
	});

	it("should receive error when user with same e-mail already exists", async () => {
		const user = userFixture({ email: "johndoe@dev.com" });
		userRepository.create(user);

		const result = await sut.execute({
			email: "johndoe@dev.com",
			name: "User 2",
			password: "S0me@Pass123",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError);
	});

	it("should create user", async () => {
		const data = {
			email: "john@dev.com",
			name: "John Doe",
			password: "S0me@Pass123",
		};

		const result = await sut.execute(data);

		expect(result.success()).toBe(true);
		expect(userRepository.users).toHaveLength(1);

		if (result.failure()) return;

		expect(result.value.user.props).toMatchObject({
			name: data.name,
			email: {
				value: data.email,
			},
		});
		expect(result.value.user.props.passwordHash).toBe("S0me@Pass123-hasher");
		expect(result.value.user.id.toValue()).toBeDefined();
	});
});
