import { describe, expect, it, vi } from "vitest";
import { SendMessageService } from "../../src/services/send-message.service";
import type { MessageBroadcaster } from "../../src/ports/message-broadcaster";
import type { MessageRepository } from "../../src/ports/message-repository";

describe("sending a room message", () => {
  it("saves the message before broadcasting it", async () => {
    const repository: MessageRepository = { save: vi.fn().mockResolvedValue(undefined) };
    const broadcaster: MessageBroadcaster = { broadcast: vi.fn() };
    const service = new SendMessageService(repository, broadcaster);

    await service.send({ roomName: "general", participantName: "Alice", text: "Hello Bob!" });

    expect(repository.save).toHaveBeenCalledWith("general", { author: "Alice", text: "Hello Bob!" });
    expect(broadcaster.broadcast).toHaveBeenCalledWith("general", { author: "Alice", text: "Hello Bob!" });
  });
});
