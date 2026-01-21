import { Injectable } from "@nestjs/common";
import { UserRepository } from "@/domain/accounts/application/repositories/user-repository";
import { UserEntity } from "@/domain/accounts/enterprise/entities/user-entity";
import { KnexService } from "../knex/knex.service";
import { UserMapper, type UserRow } from "../mappers/user-mapper";

@Injectable()
export class KnexUserRepository implements UserRepository {
	private readonly tableName = "users";

	constructor(private knex: KnexService) {}

	async findById(id: string): Promise<UserEntity | null> {
		const row = await this.knex.table<UserRow>(this.tableName).where({ id }).first();

		if (!row) {
			return null;
		}

		return UserMapper.toEntity(row);
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const row = await this.knex.table<UserRow>(this.tableName).where({ email }).first();

		if (!row) {
			return null;
		}

		return UserMapper.toEntity(row);
	}

	async create(user: UserEntity): Promise<void> {
		await this.knex.table(this.tableName).insert(UserMapper.toRow(user));
	}

	async update(user: UserEntity): Promise<void> {
		const row = UserMapper.toRow(user);
		const { id, ...updateData } = row;

		await this.knex.table(this.tableName).where({ id }).update(updateData);
	}

	async delete(id: string): Promise<void> {
		await this.knex.table(this.tableName).where({ id }).delete();
	}
}
