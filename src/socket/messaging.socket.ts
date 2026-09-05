import type { Server } from "socket.io";
import { SocketIoRoomMembership } from "../adapters/socket-io-room-membership";
import { SocketIoMessageBroadcaster } from "../adapters/socket-io-message-broadcaster";
import { SendMessageService } from "../services/send-message.service";
import { JoinRoomService } from "../services/join-room.service";
import type { MessageRepository } from "../ports/message-repository";

export function registerMessagingSocket(io: Server, repository: MessageRepository): void {
  const sendMessage = new SendMessageService(repository, new SocketIoMessageBroadcaster(io));
  io.on("connection", (socket) => {
    socket.on(
      "join-room",
      (
        command: { participantName: string; roomName: string },
        acknowledge: () => void,
      ) => {
        socket.data.participantName = command.participantName;
        socket.data.roomName = command.roomName;
        const joinRoom = new JoinRoomService(new SocketIoRoomMembership(socket));
        void joinRoom.join(command).then(acknowledge);
      },
    );
    socket.on(
      "send-message",
      (command: { text: string }, acknowledge: () => void) => {
        const room = socket.data.roomName as string | undefined;
        const author = socket.data.participantName as string | undefined;
        if (!room || !author) return;
        void sendMessage
          .send({ roomName: room, participantName: author, text: command.text })
          .then(acknowledge);
      },
    );
  });
}
