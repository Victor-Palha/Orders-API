import { faker } from "@faker-js/faker";
import { UserEntity } from "@/domain/accounts/enterprise/entities/user-entity";
import { Email } from "@/domain/accounts/enterprise/entities/value-object/email";
import { Password } from "@/domain/accounts/enterprise/entities/value-object/password";

export interface UserFixtureProps {
	id?: string;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export function userFixture(data?: Partial<UserFixtureProps>, isDomain: boolean = true) {
	let passwordHash = "john29";

	if (data?.password) {
		passwordHash = data.password;

		if (isDomain) {
			passwordHash = data.password.concat("-hashed");
		}
	}

	const name = data?.name ?? faker.person.firstName();
	const email = Email.create(data?.email ?? faker.internet.email());
	const password = Password.create(passwordHash);
	const createdAt = data?.createdAt ?? new Date();
	const updatedAt = data?.updatedAt ?? new Date();

	const user = UserEntity.create(
		{
			email,
			name,
			password,
			createdAt,
			updatedAt,
		},
		data?.id
	);

	return user;
}
