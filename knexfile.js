require('dotenv').config();
const fs = require('fs');

const config = {
	development: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST || "localhost",
			port: Number(process.env.DB_PORT) || 3306,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		},
		migrations: {
			directory: "./src/infra/database/knex/migrations",
			extension: "ts",
		},
	},
	production: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		},
		migrations: {
			directory: "./dist/infra/database/knex/migrations",
			extension: "js",
		}
	},
};

module.exports = config;