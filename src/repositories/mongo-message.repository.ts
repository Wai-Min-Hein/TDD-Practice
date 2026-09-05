import { Message as MessageModel } from "../models/message.model";
import { createMessageSchema } from "../schema/message.schema";
import type { Message } from "../ports/message-broadcaster";
import type { MessageRepository } from "../ports/message-repository";

type MessageWriter = Pick<typeof MessageModel, "create">;

export class MongoMessageRepository implements MessageRepository {
  constructor(private readonly model: MessageWriter = MessageModel) {}

  async save(roomName: string, message: Message): Promise<void> {
    const input = createMessageSchema.parse({ roomName, ...message });
    await this.model.create(input);
  }
}
