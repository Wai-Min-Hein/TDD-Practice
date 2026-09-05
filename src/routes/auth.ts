import { Router } from "express";
import { InMemoryAuthRepository } from "../adapters/in-memory-auth-repository";
import { PlainPasswordHasher } from "../adapters/plain-password-hasher";
import { RandomTokenGenerator } from "../adapters/random-token-generator";
import { AuthService } from "../services/auth.service";

const authService = new AuthService({
  repository: new InMemoryAuthRepository(),
  passwordHasher: new PlainPasswordHasher(),
  tokenGenerator: new RandomTokenGenerator(),
});
export const authRouter = Router();

authRouter.post("/register", async (request, response, next) => {
  try {
    const user = await authService.register(request.body);
    response.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (request, response) => {
  try {
    const result = await authService.login(request.body);
    response.status(200).json(result);
  } catch (error) {
    response.status(401).json({ error: (error as Error).message });
  }
});
