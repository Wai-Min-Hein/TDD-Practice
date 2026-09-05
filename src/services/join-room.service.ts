import type { RoomMembership } from "../ports/room-membership";

export interface JoinRoomCommand {
  participantName: string;
  roomName: string;
}

export class JoinRoomService {
  constructor(private readonly roomMembership: RoomMembership) {}

  join(command: JoinRoomCommand): Promise<void> {
    return this.roomMembership.addParticipant(
      command.participantName,
      command.roomName,
    );
  }
}
