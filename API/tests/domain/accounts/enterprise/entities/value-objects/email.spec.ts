import { describe, expect, it } from "vitest";
import { InvalidEmailError } from "@/domain/accounts/application/use-cases/errors/invalid-email-error";
import { Email } from "@/domain/accounts/enterprise/entities/value-object/email";

describe("VO Email", () => {
	it("should receive error when email is empty", () => {
		const result = Email.createFromText("");

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidEmailError);
	});

	it("invalid format email", () => {
		const result = Email.createFromText("john@gmail");

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidEmailError);
	});

	it("should create email from text", () => {
		const email = "john@gmail.com";

		const result = Email.createFromText(email);

		expect(result.success()).toBe(true);
		expect(result.value).toMatchObject({
			value: email,
		});
	});

	it("should create email", () => {
		const email = "john@gmail.com";

		const result = Email.create(email);

		expect(result.value).toEqual(email);
	});
});
