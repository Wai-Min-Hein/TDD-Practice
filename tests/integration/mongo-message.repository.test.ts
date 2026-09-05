import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "../../src/config/env";
import { Message } from "../../src/models/message.model";
import { MongoMessageRepository } from "../../src/repositories/mongo-message.repository";

describe("MongoMessageRepository integration", () => {
  const repository = new MongoMessageRepository();
  const roomName = `integration-${Date.now()}`;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterAll(async () => {
    await Message.deleteMany({ roomName });
    await mongoose.disconnect();
  });

  it("persists a message in MongoDB", async () => {
    await repository.save(roomName, {
      author: "Alice",
      text: "Hello Bob!",
    });

    const saved = await Message.findOne({ roomName }).lean();

    expect(saved).toMatchObject({
      roomName,
      author: "Alice",
      text: "Hello Bob!",
    });
  });
});
