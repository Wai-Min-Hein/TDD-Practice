import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { TokenGenerator } from "../ports/token-generator";

export class JwtTokenGenerator implements TokenGenerator {
  generate(userId: string): string { return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "1h" }); }
}
