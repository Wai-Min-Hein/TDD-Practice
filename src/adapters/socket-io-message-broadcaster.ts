import type { Server } from "socket.io";
import type { Message, MessageBroadcaster } from "../ports/message-broadcaster";

export class SocketIoMessageBroadcaster implements MessageBroadcaster {
  constructor(private readonly socketServer: Server) {}

  broadcast(roomName: string, message: Message): void {
    this.socketServer.to(roomName).emit("message-received", message);
  }
}
