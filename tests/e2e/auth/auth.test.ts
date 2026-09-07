import { describe, expect, it } from "vitest";
import { AuthSystemDriver } from "../support/auth-system-driver";

describe("authentication", () => {
  it("registers a user and logs in successfully", async () => {
    const system = new AuthSystemDriver();
    await system.start();
    const email = `alice-${Date.now()}@example.com`;

    const registration = await system.register({
      name: "Alice",
      email,
      password: "Password123!",
    });

    expect(registration.status).toBe(201);
    expect(registration.body.user).toMatchObject({ email });

    const login = await system.login({ email, password: "Password123!" });

    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));

    await system.stop();
  });

  it("rejects login with an incorrect password", async () => {
    const system = new AuthSystemDriver();
    await system.start();
    const email = `bob-${Date.now()}@example.com`;

    await system.register({
      name: "Bob",
      email,
      password: "Password123!",
    });

    const login = await system.login({ email, password: "WrongPassword!" });

    expect(login.status).toBe(401);
    expect(login.body).toMatchObject({ error: "Invalid credentials" });

    await system.stop();
  });

  it("rejects registration when the email is already registered", async () => {
    const system = new AuthSystemDriver();
    await system.start();
    const email = `duplicate-${Date.now()}@example.com`;
    const input = {
      name: "Alice",
      email,
      password: "Password123!",
    };

    await system.register(input);
    const duplicate = await system.register(input);

    expect(duplicate.status).toBe(409);
    expect(duplicate.body).toMatchObject({ error: "Email already registered" });

    await system.stop();
  });
});
