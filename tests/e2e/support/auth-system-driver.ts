import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { app } from "../../../src/app";

type Credentials = { email: string; password: string };
type Registration = Credentials & { name: string };
type ResponseBody = { user?: { email: string }; token?: string };

export class AuthSystemDriver {
  private server?: Server;
  private baseUrl?: string;

  async start(): Promise<void> {
    this.server = createServer(app);
    await new Promise<void>((resolve) => this.server?.listen(0, "127.0.0.1", resolve));
    const address = this.server.address() as AddressInfo;
    this.baseUrl = `http://127.0.0.1:${address.port}`;
  }

  async register(input: Registration): Promise<{ status: number; body: ResponseBody }> {
    return this.request("/api/v1/auth/register", input);
  }

  async login(input: Credentials): Promise<{ status: number; body: ResponseBody }> {
    return this.request("/api/v1/auth/login", input);
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => this.server?.close((error) => error ? reject(error) : resolve()));
  }

  private async request(path: string, body: object): Promise<{ status: number; body: ResponseBody }> {
    if (!this.baseUrl) throw new Error("System has not started");
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let parsedBody: ResponseBody = {};
    try {
      parsedBody = JSON.parse(text) as ResponseBody;
    } catch {
      // The red acceptance test may receive Express's default 404 HTML response.
    }
    return { status: response.status, body: parsedBody };
  }
}
