import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUserUseCase } from "@/domain/accounts/application/use-cases/authenticate-user-use-case";
import { WrongCredentialsError } from "@/domain/accounts/application/use-cases/errors/wrong-credentials-error";
import { userFixture } from "@/support/fixtures/user-fixture";
import { FakeEncrypter } from "../cryptography/fake-encrypter";
import { FakeHasher } from "../cryptography/fake-hasher";
import { InMemoryUserRepository } from "../repositories/in-memory-user-repository";

describe("Create User Use Case", () => {
	let userRepository: InMemoryUserRepository;
	let hasher: FakeHasher;
	let encrypter: FakeEncrypter;
	let sut: AuthenticateUserUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		hasher = new FakeHasher();
		encrypter = new FakeEncrypter();
		sut = new AuthenticateUserUseCase(userRepository, hasher, encrypter);
	});

	it("should receive error if user does not exist", async () => {
		const result = await sut.execute({
			email: "",
			password: "",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(WrongCredentialsError);
	});

	it("should receive error if user e-mail is wrong", async () => {
		const user = userFixture({ email: "johndoe@dev.com" });
		userRepository.create(user);

		const result = await sut.execute({
			email: "johndoe2@dev.com",
			password: "S0me@Pass123",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(WrongCredentialsError);
	});

	it("should receive error if user password is wrong", async () => {
		const user = userFixture({ email: "johndoe@dev.com" });
		userRepository.create(user);

		const result = await sut.execute({
			email: "johndoe@dev.com",
			password: "wrongpassword",
		});

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(WrongCredentialsError);
	});

	it("should authenticate user", async () => {
		const user = userFixture({
			email: "john@dev.com",
			name: "John Doe",
			password: "S0me@Pass123",
		});
		await userRepository.create(user);

		const result = await sut.execute({
			email: "john@dev.com",
			password: "S0me@Pass123",
		});

		expect(result.success()).toBe(true);
		if (result.failure()) return;
		expect(result.value.user.props).toMatchObject({
			name: user.props.name,
			email: user.props.email,
		});
		expect(result.value.token).toBeDefined();
		expect(result.value.user.id.toValue()).toEqual(user.id.toValue());
	});
});
