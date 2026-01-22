import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import Knex, { Knex as KnexType } from "knex";
import { EnvService } from "../../configs/env/env.service";

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
	private knexInstance: KnexType;

	constructor(private env: EnvService) {
		this.knexInstance = Knex({
			client: "mysql2",
			connection: {
				host: this.env.get("DB_HOST"),
				port: this.env.get("DB_PORT"),
				user: this.env.get("DB_USER"),
				password: this.env.get("DB_PASSWORD"),
				database: this.env.get("DB_NAME"),
			},
			pool: {
				min: 2,
				max: 10,
			},
			debug: this.env.get("NODE_ENV") === "development",
		});
	}

	async onModuleInit() {
		try {
			await this.knexInstance.raw("SELECT 1");
			console.log("✅ Database connected successfully");
		} catch (error) {
			console.error("❌ Database connection failed:", error);
			throw error;
		}
	}

	async onModuleDestroy() {
		await this.knexInstance.destroy();
		console.log("🔌 Database connection closed");
	}

	get instance(): KnexType {
		return this.knexInstance;
	}

	table<T extends {} = any>(tableName: string) {
		return this.knexInstance<T>(tableName);
	}

	raw(sql: string, bindings?: any) {
		return this.knexInstance.raw(sql, bindings);
	}

	transaction() {
		return this.knexInstance.transaction();
	}
}
