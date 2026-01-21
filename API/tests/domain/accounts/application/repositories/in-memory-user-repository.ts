import { DomainEvents } from "@/core/events/domain-events";
import { UserRepository } from "@/domain/accounts/application/repositories/user-repository";
import { UserEntity } from "@/domain/accounts/enterprise/entities/user-entity";

export class InMemoryUserRepository implements UserRepository {
	public users: UserEntity[] = [];

	public async findById(id: string): Promise<UserEntity | null> {
		const user = this.users.find(item => item.id.toValue() === id);
		return user ?? null;
	}

	public async findByEmail(email: string): Promise<UserEntity | null> {
		const user = this.users.find(item => item.props.email.value === email);
		return user ?? null;
	}

	public async create(user: UserEntity): Promise<void> {
		this.users.push(user);

		DomainEvents.dispatchEventsForAggregate(user.id);
	}

	public async update(user: UserEntity): Promise<void> {
		const userIndex = this.users.findIndex(item => item.equals(user));
		this.users[userIndex] = user;
	}

	public async delete(id: string): Promise<void> {
		this.users = this.users.filter(user => user.id.toValue() !== id);
	}
}
