import { beforeEach, describe, expect, it, vi } from "vitest";
import { SendMessageService } from "../../src/services/send-message.service";
import type { MessageBroadcaster } from "../../src/ports/message-broadcaster";
import type { MessageRepository } from "../../src/ports/message-repository";

const fakeCommand = {
  roomName: "general",
  participantName: "Alice",
  text: "Hello Bob!",
};

const mockRepository: MessageRepository = {
  save: vi.fn(),
};

const mockBroadcaster: MessageBroadcaster = {
  broadcast: vi.fn(),
};

const service = new SendMessageService(mockRepository, mockBroadcaster);

describe("sending a room message", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves the message before broadcasting it", async () => {
    vi.mocked(mockRepository.save).mockResolvedValue(undefined);

    const result = await service.send(fakeCommand);

    expect(result).toBeUndefined();
    expect(mockRepository.save).toHaveBeenCalledWith("general", {
      author: "Alice",
      text: "Hello Bob!",
    });
    expect(mockBroadcaster.broadcast).toHaveBeenCalledWith("general", {
      author: "Alice",
      text: "Hello Bob!",
    });
  });
});
