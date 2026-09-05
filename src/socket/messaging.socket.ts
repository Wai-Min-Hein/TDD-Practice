import type { Server } from "socket.io";

export function registerMessagingSocket(io: Server): void {
  io.on("connection", (socket) => {
    socket.on(
      "join-room",
      (
        command: { participantName: string; roomName: string },
        acknowledge: () => void,
      ) => {
        socket.data.participantName = command.participantName;
        socket.data.roomName = command.roomName;
        void Promise.resolve(socket.join(command.roomName)).then(acknowledge);
      },
    );
    socket.on(
      "send-message",
      (command: { text: string }, acknowledge: () => void) => {
        const room = socket.data.roomName as string | undefined;
        const author = socket.data.participantName as string | undefined;
        if (!room || !author) return;
        io.to(room).emit("message-received", { author, text: command.text });
        acknowledge();
      },
    );
  });
}
