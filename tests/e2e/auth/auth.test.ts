import { describe, expect, it } from "vitest";
import { AuthSystemDriver } from "../support/auth-system-driver";

describe("authentication", () => {
  it("registers a user and logs in successfully", async () => {
    const system = new AuthSystemDriver();
    await system.start();

    const registration = await system.register({
      name: "Alice",
      email: "alice@example.com",
      password: "Password123!",
    });

    expect(registration.status).toBe(201);
    expect(registration.body.user).toMatchObject({ email: "alice@example.com" });

    const login = await system.login({
      email: "alice@example.com",
      password: "Password123!",
    });

    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));

    await system.stop();
  });

  it("rejects login with an incorrect password", async () => {
    const system = new AuthSystemDriver();
    await system.start();

    await system.register({
      name: "Bob",
      email: "bob@example.com",
      password: "Password123!",
    });

    const login = await system.login({
      email: "bob@example.com",
      password: "WrongPassword!",
    });

    expect(login.status).toBe(401);
    expect(login.body).toMatchObject({ error: "Invalid credentials" });

    await system.stop();
  });
});
