import { describe, expect, it, vi } from "vitest";
import { MongoMessageRepository } from "../../src/adapters/mongo-message.repository";

describe("MongoMessageRepository", () => {
  it("creates a message document", async () => {
    const create = vi.fn().mockResolvedValue(undefined);
    const repository = new MongoMessageRepository({ create } as never);

    await repository.save("general", { author: "Alice", text: "Hello Bob!" });

    expect(create).toHaveBeenCalledWith({
      roomName: "general",
      author: "Alice",
      text: "Hello Bob!",
    });
  });

  it("rejects invalid message data", async () => {
    const create = vi.fn();
    const repository = new MongoMessageRepository({ create } as never);

    await expect(repository.save("general", { author: "", text: "" })).rejects.toThrow();
    expect(create).not.toHaveBeenCalled();
  });
});
