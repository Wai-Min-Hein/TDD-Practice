import type { Socket } from "socket.io";
import type { RoomMembership } from "../ports/room-membership";

export class SocketIoRoomMembership implements RoomMembership {
  constructor(private readonly socket: Socket) {}

  addParticipant(_participantName: string, roomName: string): Promise<void> {
    return Promise.resolve(this.socket.join(roomName));
  }
}
