import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import z from "zod";
import { EnvService } from "../env/env.service";

const jwtPayload = z.object({
	sub: z.uuid(),
});

export type JwtPayload = z.infer<typeof jwtPayload>;

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
	constructor(env: EnvService) {
		const publicKey = env.get("JWT_PUBLIC_KEY");

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: Buffer.from(publicKey, "base64"),
			algorithms: ["RS256"],
		});
	}

	async validate(payload: JwtPayload) {
		return jwtPayload.parse(payload);
	}
}
