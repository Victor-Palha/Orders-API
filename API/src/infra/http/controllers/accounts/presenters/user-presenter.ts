import { UserEntity } from "@/domain/accounts/enterprise/entities/user-entity";
import { UserResponseScalar } from "./user-reponse-scalar";

export class UserPresenter {
	public static toHttp(user: UserEntity): UserResponseScalar {
		return {
			id: user.id.toValue(),
			name: user.props.name,
			email: user.props.email.value,
			created_at: user.props.createdAt ?? new Date(),
			updated_at: user.props.updatedAt ?? new Date(),
		};
	}

	public static toHttpList(users: UserEntity[]): UserResponseScalar[] {
		return users.map(user => this.toHttp(user));
	}
}
