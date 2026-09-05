import type { RoomMembership } from "../ports/room-membership";

export class JoinRoomHandler {
  constructor(private readonly roomMembership: RoomMembership) {}

  handle(command: { participantName: string; roomName: string }): Promise<void> {
    return this.roomMembership.addParticipant(command.participantName, command.roomName);
  }
}
