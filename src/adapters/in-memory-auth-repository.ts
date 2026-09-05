import type { AuthRepository, AuthUser } from "../ports/auth-repository";

export class InMemoryAuthRepository implements AuthRepository {
  private readonly users = new Map<string, AuthUser>();

  async create(input: Omit<AuthUser, "id">): Promise<AuthUser> {
    const user = { id: crypto.randomUUID(), ...input };
    this.users.set(user.email, user);
    return user;
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.users.get(email) ?? null;
  }
}
