import { AuthUser } from "../models/auth-user.model";
import type { AuthRepository, AuthUser as User } from "../ports/auth-repository";

export class MongoAuthRepository implements AuthRepository {
  async create(input: Omit<User, "id">): Promise<User> {
    const user = await AuthUser.create(input);
    return { id: user.id, name: user.name, email: user.email, passwordHash: user.passwordHash };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await AuthUser.findOne({ email }).select("+passwordHash").lean();
    return user ? { id: String(user._id), name: user.name, email: user.email, passwordHash: user.passwordHash } : null;
  }
}
