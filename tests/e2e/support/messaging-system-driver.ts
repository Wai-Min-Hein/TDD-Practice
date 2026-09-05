export type SeenMessage = Readonly<{
  author: string;
  text: string;
}>;

/**
 * The domain-facing boundary for the acceptance suite.
 *
 * Socket.IO event names, ports, acknowledgements, and connection cleanup belong
 * behind this API. They will be introduced while growing the walking skeleton.
 */
export class MessagingSystemDriver {
  private httpServer?: HttpServer;
  private socketServer?: SocketIOServer;
  private readonly participants = new Map<string, Socket>();
  private readonly receivedMessages = new Map<string, SeenMessage[]>();

  async start(): Promise<void> {
    this.httpServer = createServer(app);
    this.socketServer = new SocketIOServer(this.httpServer, {
      transports: ["websocket"],
    });
    registerMessagingSocket(this.socketServer, { save: async () => {} });
    await new Promise<void>((resolve) =>
      this.httpServer?.listen(0, "127.0.0.1", resolve),
    );
  }

  async participantJoinsRoom(
    participantName: string,
    roomName: string,
  ): Promise<void> {
    const httpServer = this.httpServer;
    if (!httpServer) throw new Error("System has not started");
    const port = (httpServer.address() as { port: number }).port;
    const participant = io(`http://127.0.0.1:${port}`, {
      transports: ["websocket"],
    });
    this.participants.set(participantName, participant);
    this.receivedMessages.set(participantName, []);
    participant.on("message-received", (message: SeenMessage) =>
      this.receivedMessages.get(participantName)?.push(message),
    );
    await new Promise<void>((resolve, reject) => {
      participant.once("connect_error", reject);
      participant.once("connect", () =>
        participant.emit("join-room", { participantName, roomName }, resolve),
      );
    });
  }

  async participantSendsMessage(
    participantName: string,
    text: string,
  ): Promise<void> {
    const participant = this.participants.get(participantName);
    if (!participant)
      throw new Error(`Unknown participant: ${participantName}`);
    await new Promise<void>((resolve) =>
      participant.emit("send-message", { text }, resolve),
    );
  }

  async messagesSeenBy(participantName: string): Promise<SeenMessage[]> {
    const messages = this.receivedMessages.get(participantName) ?? [];
    const deadline = Date.now() + 1_000;
    while (messages.length === 0 && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 10));
    return [...messages];
  }

  async stop(): Promise<void> {
    for (const participant of this.participants.values())
      participant.disconnect();
    this.participants.clear();
    await this.socketServer?.close();
    if (this.httpServer?.listening)
      await new Promise<void>((resolve) =>
        this.httpServer?.close(() => resolve()),
      );
    this.socketServer = undefined;
    this.httpServer = undefined;
  }
}
import { createServer, type Server as HttpServer } from "node:http";
import { io, type Socket } from "socket.io-client";
import { Server as SocketIOServer } from "socket.io";
import { app } from "../../../src/app";
import { registerMessagingSocket } from "../../../src/socket/messaging.socket";
