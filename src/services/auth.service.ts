import type { AuthRepository, AuthUser } from "../ports/auth-repository";
import type { PasswordHasher } from "../ports/password-hasher";
import type { TokenGenerator } from "../ports/token-generator";

export interface RegisterCommand {
  name: string;
  email: string;
  password: string;
}

export interface LoginCommand {
  email: string;
  password: string;
}

interface AuthServiceDependencies {
  repository: AuthRepository;
  passwordHasher: PasswordHasher;
  tokenGenerator: TokenGenerator;
}

export class AuthService {
  constructor(private readonly dependencies: AuthServiceDependencies) {}

  async register(command: RegisterCommand): Promise<Pick<AuthUser, "id" | "name" | "email">> {
    const passwordHash = await this.dependencies.passwordHasher.hash(command.password);
    const user = await this.dependencies.repository.create({
      name: command.name,
      email: command.email,
      passwordHash,
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  async login(command: LoginCommand): Promise<{ token: string }> {
    const user = await this.dependencies.repository.findByEmail(command.email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await this.dependencies.passwordHasher.compare(
      command.password,
      user.passwordHash,
    );
    if (!valid) throw new Error("Invalid credentials");

    return { token: this.dependencies.tokenGenerator.generate(user.id) };
  }
}
