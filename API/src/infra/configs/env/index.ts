import z from "zod";

export const envSchema = z.object({
	// DATABASE_URL: z.url("Invalid url!"),
	PORT: z.coerce.number().default(3333),
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	HASHER_SALT: z.coerce.number().min(1, "Hashers salt is required!").default(12),
	JWT_PRIVATE_KEY: z.string().min(1, "JWT secret is required!"),
	JWT_PUBLIC_KEY: z.string().min(1, "JWT public key is required!"),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	AWS_REGION: z.string().default("us-east-1"),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_ENDPOINT_URL: z.string().optional(),
	SQS_ORDERS_QUEUE_URL: z.string(),
	SQS_ORDERS_OUTPUT_QUEUE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
