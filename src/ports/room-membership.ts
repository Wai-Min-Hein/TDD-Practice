export interface RoomMembership {
  addParticipant(participantName: string, roomName: string): Promise<void>;
}
