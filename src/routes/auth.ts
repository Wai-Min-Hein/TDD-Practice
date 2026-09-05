import { randomUUID } from "node:crypto";
import { Router } from "express";

type User = { name: string; email: string; password: string };

const users = new Map<string, User>();
export const authRouter = Router();

authRouter.post("/register", (request, response) => {
  const user = request.body as User;
  users.set(user.email, user);

  response.status(201).json({
    user: { name: user.name, email: user.email },
  });
});

authRouter.post("/login", (request, response) => {
  const credentials = request.body as Pick<User, "email" | "password">;
  const user = users.get(credentials.email);

  if (!user || user.password !== credentials.password) {
    response.status(401).json({ error: "Invalid credentials" });
    return;
  }

  response.status(200).json({ token: randomUUID() });
});
