export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface AuthRepository {
  create(user: Omit<AuthUser, "id">): Promise<AuthUser>;
  findByEmail(email: string): Promise<AuthUser | null>;
}
