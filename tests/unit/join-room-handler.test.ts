import { describe, expect, it, vi } from "vitest";
import { JoinRoomHandler } from "../../src/domain/join-room-handler";
import type { RoomMembership } from "../../src/ports/room-membership";

describe("joining a room", () => {
  it("adds the participant to the requested room", async () => {
    const roomMembership: RoomMembership = {
      addParticipant: vi.fn().mockResolvedValue(undefined),
    };
    const handler = new JoinRoomHandler(roomMembership);

    await handler.handle({ participantName: "Alice", roomName: "general" });

    expect(roomMembership.addParticipant).toHaveBeenCalledWith("Alice", "general");
  });
});
