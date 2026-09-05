import type { TokenGenerator } from "../ports/token-generator";

export class RandomTokenGenerator implements TokenGenerator {
  generate(_userId: string): string { return crypto.randomUUID(); }
}
