import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvService } from "./infra/configs/env/env.service";
import { createOpenAPIDocument } from "./infra/http/documentation/scalar-config";
import { EitherInterceptor } from "./infra/http/interceptors/either-interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalInterceptors(new EitherInterceptor());

	const envService = app.get(EnvService);
	const port = envService.get("PORT");
	const nodeEnv = envService.get("NODE_ENV");

	app.enableCors({
		origin: "*",
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		exposedHeaders: ["set-cookie"],
	});

	if (nodeEnv !== "production") {
		createOpenAPIDocument(app);
	}

	await app.listen(port);
}
bootstrap();
