import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../../src/services/auth.service";
import type { AuthRepository } from "../../src/ports/auth-repository";
import type { PasswordHasher } from "../../src/ports/password-hasher";
import type { TokenGenerator } from "../../src/ports/token-generator";
import { DuplicateEmailError } from "../../src/services/auth.errors";

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

  it("rejects registration when the email already exists", async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(fakeUser);

    await expect(service.register(fakeRegistration)).rejects.toBeInstanceOf(
      DuplicateEmailError,
    );

    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("rejects login when the user does not exist", async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);

    await expect(
      service.login({ email: fakeRegistration.email, password: fakeRegistration.password }),
    ).rejects.toThrow("Invalid credentials");

    expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
    expect(mockTokenGenerator.generate).not.toHaveBeenCalled();
  });

  it("rejects login when the password is incorrect", async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(fakeUser);
    vi.mocked(mockPasswordHasher.compare).mockResolvedValue(false);

    await expect(
      service.login({ email: fakeUser.email, password: "WrongPassword!" }),
    ).rejects.toThrow("Invalid credentials");

    expect(mockTokenGenerator.generate).not.toHaveBeenCalled();
  });

  it("propagates repository failures during registration", async () => {
    vi.mocked(mockRepository.findByEmail).mockRejectedValue(
      new Error("Database unavailable"),
    );

    await expect(service.register(fakeRegistration)).rejects.toThrow(
      "Database unavailable",
    );

    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
  });
});
