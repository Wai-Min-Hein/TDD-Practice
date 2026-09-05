import type { Server } from "socket.io";
import { JoinRoomHandler } from "../domain/join-room-handler";
import { SocketIoRoomMembership } from "../adapters/socket-io-room-membership";
import { SendMessageHandler } from "../domain/send-message-handler";
import { SocketIoMessageBroadcaster } from "../adapters/socket-io-message-broadcaster";

export function registerMessagingSocket(io: Server): void {
  const sendMessage = new SendMessageHandler(new SocketIoMessageBroadcaster(io));
  io.on("connection", (socket) => {
    socket.on(
      "join-room",
      (
        command: { participantName: string; roomName: string },
        acknowledge: () => void,
      ) => {
        socket.data.participantName = command.participantName;
        socket.data.roomName = command.roomName;
        const joinRoom = new JoinRoomHandler(new SocketIoRoomMembership(socket));
        void joinRoom.handle(command).then(acknowledge);
      },
    );
    socket.on(
      "send-message",
      (command: { text: string }, acknowledge: () => void) => {
        const room = socket.data.roomName as string | undefined;
        const author = socket.data.participantName as string | undefined;
        if (!room || !author) return;
        sendMessage.handle({ roomName: room, participantName: author, text: command.text });
        acknowledge();
      },
    );
  });
}
