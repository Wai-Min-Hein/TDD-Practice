import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../../src/services/auth.service";
import type { AuthRepository } from "../../src/ports/auth-repository";
import type { PasswordHasher } from "../../src/ports/password-hasher";
import type { TokenGenerator } from "../../src/ports/token-generator";

const fakeRegistration = {
  name: "Alice",
  email: "alice@example.com",
  password: "Password123!",
};

const fakeUser = {
  id: "user-1",
  name: "Alice",
  email: "alice@example.com",
  passwordHash: "hashed-password",
};

const mockRepository: AuthRepository = {
  create: vi.fn(),
  findByEmail: vi.fn(),
};

const mockPasswordHasher: PasswordHasher = {
  hash: vi.fn(),
  compare: vi.fn(),
};

const mockTokenGenerator: TokenGenerator = {
  generate: vi.fn(),
};

const service = new AuthService({
  repository: mockRepository,
  passwordHasher: mockPasswordHasher,
  tokenGenerator: mockTokenGenerator,
});

describe("AuthService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("registers a user with a hashed password", async () => {
    vi.mocked(mockPasswordHasher.hash).mockResolvedValue(fakeUser.passwordHash);
    vi.mocked(mockRepository.create).mockResolvedValue(fakeUser);

    const result = await service.register(fakeRegistration);

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(fakeRegistration.password);
    expect(mockRepository.create).toHaveBeenCalledWith({
      name: fakeRegistration.name,
      email: fakeRegistration.email,
      passwordHash: fakeUser.passwordHash,
    });
    expect(result).toEqual({ id: fakeUser.id, name: fakeUser.name, email: fakeUser.email });
  });

  it("logs in with valid credentials and returns a token", async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(fakeUser);
    vi.mocked(mockPasswordHasher.compare).mockResolvedValue(true);
    vi.mocked(mockTokenGenerator.generate).mockReturnValue("token-1");

    const result = await service.login({ email: fakeUser.email, password: fakeRegistration.password });

    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(fakeRegistration.password, fakeUser.passwordHash);
    expect(mockTokenGenerator.generate).toHaveBeenCalledWith(fakeUser.id);
    expect(result).toEqual({ token: "token-1" });
  });
});
