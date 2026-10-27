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

  it("keeps messages within their room", async () => {
    await system.start();
    await system.participantJoinsRoom("Alice", "private");
    await system.participantJoinsRoom("Bob", "general");
    await system.participantJoinsRoom("Carol", "general");

    await system.participantSendsMessage("Alice", "Private message");
    await system.participantSendsMessage("Carol", "Hello Bob!");

    await expect(system.messagesSeenBy("Bob")).resolves.toEqual([
      { author: "Carol", text: "Hello Bob!" },
    ]);
  });

  it("stops receiving messages from the previous room after switching rooms", async () => {
    await system.start();
    await system.participantJoinsRoom("Alice", "general");
    await system.participantJoinsRoom("Bob", "general");
    await system.participantJoinsRoom("Carol", "other");
    await system.participantJoinsRoom("Bob", "other");

    await system.participantSendsMessage("Alice", "Old room message");
    await system.participantSendsMessage("Carol", "New room message");

    await expect(system.messagesSeenBy("Bob")).resolves.toEqual([
      { author: "Carol", text: "New room message" },
    ]);
  });
});


