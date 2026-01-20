import { EntityBase } from "@/core/entities/entity-base";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Email } from "./value-object/email";
import { Password } from "./value-object/password";

export type UserProps = {
	name: string;
	email: Email;
	password: Password;
	passwordHash?: string;
	createdAt: Date;
	updatedAt: Date;
};

export class UserEntity extends EntityBase<UserProps> {
	static create(props: UserProps, id?: string) {
		return new UserEntity(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			new UniqueEntityID(id)
		);
	}
}
