import { beforeEach, describe, expect, it, vi } from "vitest";
import { JoinRoomService } from "../../src/services/join-room.service";
import type { RoomMembership } from "../../src/ports/room-membership";

const fakeCommand = {
  participantName: "Alice",
  roomName: "general",
};

const mockRoomMembership: RoomMembership = {
  addParticipant: vi.fn(),
};

const service = new JoinRoomService(mockRoomMembership);

describe("joining a room", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockRoomMembership.addParticipant).mockResolvedValue(undefined);
  });

  it("adds the participant to the requested room", async () => {
    const result = await service.join(fakeCommand);

    expect(result).toBeUndefined();
    expect(mockRoomMembership.addParticipant).toHaveBeenCalledWith(
      "Alice",
      "general",
    );
  });
});
