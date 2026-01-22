import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

type ErrorResponseOptions = {
	status: HttpStatus;
	description: string;
	message: string;
	error: string;
};

export function ErrorResponseScalar({ status, description, message, error }: ErrorResponseOptions) {
	return applyDecorators(
		ApiResponse({
			status,
			description,
			schema: {
				type: "object",
				properties: {
					statusCode: { type: "integer", example: status },
					error: { type: "string", example: error },
					message: { type: "string", example: message },
				},
			},
		})
	);
}
