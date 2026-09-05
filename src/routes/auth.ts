import { Router } from "express";
import { MongoAuthRepository } from "../adapters/mongo-auth.repository";
import { BcryptPasswordHasher } from "../adapters/bcrypt-password-hasher";
import { JwtTokenGenerator } from "../adapters/jwt-token-generator";
import { AuthService } from "../services/auth.service";

const authService = new AuthService({
  repository: new MongoAuthRepository(),
  passwordHasher: new BcryptPasswordHasher(),
  tokenGenerator: new JwtTokenGenerator(),
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
