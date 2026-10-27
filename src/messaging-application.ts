import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { Server } from "socket.io";

import { createApp } from "./app";
import { registerMessaging, type MessagingServer } from "./socket/messaging.socket";

export class MessagingApplication {
  private readonly httpServer = createServer(createApp());
  private readonly io: MessagingServer = new Server(this.httpServer);

  constructor() {
    registerMessaging(this.io);
  }

  async start(port = 0, host = "127.0.0.1"): Promise<string> {
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => reject(error);
      this.httpServer.once("error", onError);
      this.httpServer.listen(port, host, () => {
        this.httpServer.off("error", onError);
        resolve();
      });
    });
    const address = this.httpServer.address() as AddressInfo;
    return `http://${host}:${address.port}`;
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolve) => this.io.close(() => resolve()));
  }
}
