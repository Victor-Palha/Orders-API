import { describe, expect, it } from "vitest";
import { InvalidPasswordError } from "@/domain/accounts/application/use-cases/errors/invalid-password-error";
import { Password } from "@/domain/accounts/enterprise/entities/value-object/password";

describe("VO Password", () => {
	it("should receive error when password lenght is less than 6 characters", () => {
		const result = Password.createFromText("12345");

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidPasswordError);
	});

	it("password without bigger letters", () => {
		const password = Password.createFromText("test123@");

		expect(password.failure()).toBe(true);
		expect(password.value).toBeInstanceOf(InvalidPasswordError);
	});

	it("password without lower letters", () => {
		const password = Password.createFromText("TE2E123@");

		expect(password.failure()).toBe(true);
		expect(password.value).toBeInstanceOf(InvalidPasswordError);
	});

	it("password without numbers", () => {
		const password = Password.createFromText("dsiand@iT");

		expect(password.failure()).toBe(true);
		expect(password.value).toBeInstanceOf(InvalidPasswordError);
	});

	it("password without symbols", () => {
		const password = Password.createFromText("test123T");

		expect(password.failure()).toBe(true);
		expect(password.value).toBeInstanceOf(InvalidPasswordError);
	});

	it("should receive a valid password", () => {
		const result = Password.createFromText("Pass@123");
		if (result.failure()) return;

		expect(result.value.value).toEqual("Pass@123");
	});

	it("should receive a password when create method is called", () => {
		const result = Password.create("123456");

		expect(result.value).toEqual("123456");
	});
});
