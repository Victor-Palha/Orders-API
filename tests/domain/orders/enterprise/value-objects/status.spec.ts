import { describe, expect, it } from "vitest";
import { InvalidStatusError } from "@/domain/orders/application/use-cases/errors/invalid-status-error";
import { StatusEnum } from "@/domain/orders/enterprise/enums/status.enum";
import { Status } from "@/domain/orders/enterprise/value-object/status";

describe("VO Status", () => {
	it("should receive error when status is invalid", () => {
		const result = Status.createFromText("INVALID_STATUS");

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidStatusError);
	});

	it("should receive error when status is empty", () => {
		const result = Status.createFromText("");

		expect(result.failure()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidStatusError);
	});

	it("should create status from text", () => {
		const status = StatusEnum.PENDING;

		const result = Status.createFromText(status);

		expect(result.success()).toBe(true);
		expect(result.value).toMatchObject({
			value: status,
		});
	});

	it("should create status", () => {
		const status = StatusEnum.PROCESSING;

		const result = Status.create(status);

		expect(result.value).toEqual(status);
	});

	it("should validate status correctly", () => {
		expect(Status.validate(StatusEnum.PENDING)).toBe(true);
		expect(Status.validate(StatusEnum.PROCESSING)).toBe(true);
		expect(Status.validate(StatusEnum.PROCESSED)).toBe(true);
		expect(Status.validate(StatusEnum.COMPLETED)).toBe(true);
		expect(Status.validate(StatusEnum.CANCELLED)).toBe(true);
		expect(Status.validate("INVALID")).toBe(false);
		expect(Status.validate("")).toBe(false);
	});
});
