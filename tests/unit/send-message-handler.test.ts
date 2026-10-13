import { describe, expect, it, vi } from "vitest";
import { SendMessageHandler } from "../../src/domain/send-message-handler";
import type { MessageBroadcaster } from "../../src/ports/message-broadcaster";

describe("sending a room message", () => {
  it("broadcasts the participant's message to their room", () => {
    const broadcaster: MessageBroadcaster = { broadcast: vi.fn() };
    const handler = new SendMessageHandler(broadcaster);

    handler.handle({ roomName: "general", participantName: "Alice", text: "Hello Bob!" });

    expect(broadcaster.broadcast).toHaveBeenCalledWith("general", {
      author: "Alice",
      text: "Hello Bob!",
    });
  });
});
