import type { Server } from "socket.io";

export type Message = Readonly<{ author: string; text: string }>;
export type Acknowledgement = { ok: true } | { ok: false; error: string };

export interface ClientEvents {
  "join-room": (
    participant: { participantName: string; roomName: string },
    acknowledge: (result: Acknowledgement) => void,
  ) => void;
  "send-message": (
    message: { text: string },
    acknowledge: (result: Acknowledgement) => void,
  ) => void;
}

export interface ServerEvents {
  message: (message: Message) => void;
}

interface ParticipantData {
  participantName?: string;
  room?: string;
}

export type MessagingServer = Server<
  ClientEvents,
  ServerEvents,
  Record<string, never>,
  ParticipantData
>;

export function registerMessaging(io: MessagingServer): void {
  io.on("connection", (socket) => {
    socket.on("join-room", async ({ participantName, roomName }, acknowledge) => {
      // Keep domain rooms separate from Socket.IO's per-connection rooms.
      const room = `room:${roomName}`;
      if (socket.data.room) {
        await socket.leave(socket.data.room);
      }
      await socket.join(room);
      socket.data.participantName = participantName;
      socket.data.room = room;
      acknowledge({ ok: true });
    });

    socket.on("send-message", ({ text }, acknowledge) => {
      const { participantName, room } = socket.data;
      if (participantName === undefined || room === undefined) {
        acknowledge({ ok: false, error: "Join a room before sending a message" });
        return;
      }

      io.to(room).emit("message", { author: participantName, text });
      acknowledge({ ok: true });
    });
  });
}
