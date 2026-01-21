import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("order_items", table => {
		table.uuid("id").primary();
		table.uuid("order_id").notNullable();
		table.integer("product_id").notNullable();
		table.string("product_name", 255).notNullable();
		table.integer("quantity").notNullable();
		table.decimal("unit_price", 10, 2).notNullable();
		table.decimal("total_price", 10, 2).notNullable();
		table.timestamps(true, true);

		table.index("order_id");
		table.foreign("order_id").references("id").inTable("orders").onDelete("CASCADE");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("order_items");
}
