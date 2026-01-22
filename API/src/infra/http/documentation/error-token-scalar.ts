import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function ErroTokenScalar() {
	return applyDecorators(
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: "Unauthorized - Tokens inexistentes ou inválidos.",
			example: {
				statusCode: 401,
				error: "INVALID_TOKEN_ERROR",
				message: "Tokens inexistentes ou inválidos.",
			},
			schema: {
				type: "object",
				properties: {
					statusCode: { type: "integer", example: HttpStatus.UNAUTHORIZED },
					error: { type: "string", example: "Unauthorized" },
					message: { type: "string", example: "Tokens inexistentes ou inválidos." },
				},
			},
		})
	);
}
