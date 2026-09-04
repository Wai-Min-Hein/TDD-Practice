import { afterEach, describe, expect, it } from "vitest";

import { MessagingSystemDriver } from "./support/messaging-system-driver";

describe("room messaging", () => {
  const system = new MessagingSystemDriver();

  afterEach(async () => {
    await system.stop();
  });

  it("delivers a message to another participant in the same room", async () => {
    await system.start();

    await system.participantJoinsRoom("Alice", "general");
    await system.participantJoinsRoom("Bob", "general");

    await system.participantSendsMessage("Alice", "Hello Bob!");

    await expect(
      system.messagesSeenBy("Bob"),
    ).resolves.toContainEqual({
      author: "Alice",
      text: "Hello Bob!",
    });
  });
});


