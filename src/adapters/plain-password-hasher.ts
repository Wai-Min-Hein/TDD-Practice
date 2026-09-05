import type { PasswordHasher } from "../ports/password-hasher";

export class PlainPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> { return password; }
  async compare(password: string, passwordHash: string): Promise<boolean> { return password === passwordHash; }
}
