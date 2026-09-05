import { describe, expect, it, vi } from "vitest";
import { JoinRoomService } from "../../src/services/join-room.service";
import type { RoomMembership } from "../../src/ports/room-membership";

describe("joining a room", () => {
  it("adds the participant to the requested room", async () => {
    const roomMembership: RoomMembership = {
      addParticipant: vi.fn().mockResolvedValue(undefined),
    };
    const service = new JoinRoomService(roomMembership);

    await service.join({ participantName: "Alice", roomName: "general" });

    expect(roomMembership.addParticipant).toHaveBeenCalledWith("Alice", "general");
  });
});
