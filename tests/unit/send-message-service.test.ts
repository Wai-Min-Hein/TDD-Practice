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

  it("does not broadcast when saving fails", async () => {
    vi.mocked(mockRepository.save).mockRejectedValue(
      new Error("Database unavailable"),
    );

    await expect(service.send(fakeCommand)).rejects.toThrow(
      "Database unavailable",
    );

    expect(mockBroadcaster.broadcast).not.toHaveBeenCalled();
  });

  it("persists the message even when broadcasting fails", async () => {
    vi.mocked(mockRepository.save).mockResolvedValue(undefined);
    vi.mocked(mockBroadcaster.broadcast).mockImplementation(() => {
      throw new Error("Socket.IO unavailable");
    });

    await expect(service.send(fakeCommand)).rejects.toThrow(
      "Socket.IO unavailable",
    );

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
