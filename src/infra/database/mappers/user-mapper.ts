import { UserEntity } from "@/domain/accounts/enterprise/entities/user-entity";
import { Email } from "@/domain/accounts/enterprise/entities/value-object/email";
import { Password } from "@/domain/accounts/enterprise/entities/value-object/password";

export interface UserRow {
	id: string;
	name: string;
	email: string;
	password_hash: string;
	created_at: Date;
	updated_at: Date;
}

export abstract class UserMapper {
	static toEntity(row: UserRow): UserEntity {
		return UserEntity.create(
			{
				name: row.name,
				email: Email.create(row.email),
				password: Password.create(""), // Empty password since we only store hash
				passwordHash: row.password_hash,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			},
			row.id
		);
	}

	static toRow(user: UserEntity): UserRow {
		return {
			id: user.id.toValue(),
			name: user.props.name,
			email: user.props.email.value,
			password_hash: user.props.passwordHash ?? user.props.password.value,
			created_at: user.props.createdAt ?? new Date(),
			updated_at: user.props.updatedAt ?? new Date(),
		};
	}
}
