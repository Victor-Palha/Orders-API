import { describe, expect, it } from "vitest";
import { UserEntity, type UserProps } from "@/domain/accounts/enterprise/entities/user-entity";
import { Email } from "@/domain/accounts/enterprise/entities/value-object/email";
import { Password } from "@/domain/accounts/enterprise/entities/value-object/password";

describe("User Entity", () => {
	const validProps: UserProps = {
		name: "John Doe",
		email: Email.create("john.doe@example.com"),
		password: Password.create("Securepassword@123"),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	it("Should be able to create a user entity without id", () => {
		const user = UserEntity.create(validProps);
		expect(user).toBeInstanceOf(UserEntity);
		expect(user.props).toEqual(validProps);
		expect(user.id).toBeDefined();
	});

	it("Should be able to create a user entity with id", () => {
		const id = "custom-user-id-456";
		const user = UserEntity.create(validProps, id);
		expect(user).toBeInstanceOf(UserEntity);
		expect(user.props).toEqual(validProps);
		expect(user.id.toValue()).toBe(id);
	});
});
