import { BadRequestException, PipeTransform } from "@nestjs/common";
import z, { ZodError, ZodType } from "zod";

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodType) {}

	transform(value: unknown) {
		try {
			return this.schema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					message: "Validation failed",
					error: "BAD_REQUEST_ERROR",
					statusCode: 400,
					errors: z.prettifyError(error),
				});
			}
		}
	}
}
