import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

export function createOpenAPIDocument(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle("Orders API")
		.setDescription("Documentação da API do Orders")
		.setVersion("1.0.0")
		.addBasicAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	app.use(
		"/docs",
		apiReference({
			theme: "bluePlanet",
			content: document,
		})
	);
}
