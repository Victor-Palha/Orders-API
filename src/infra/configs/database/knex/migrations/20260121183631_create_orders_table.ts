import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("orders", table => {
		table.uuid("id").primary();
		table.string("name", 255).notNullable();
		table.uuid("user_id").notNullable();
		table.string("status", 50).notNullable();
		table.decimal("total_amount", 10, 2).notNullable();
		table.timestamp("processed_at").nullable();
		table.timestamps(true, true);

		table.index("user_id");
		table.index("status");
		table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("orders");
}
