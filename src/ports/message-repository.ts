import type { Message } from "./message-broadcaster";

export interface MessageRepository {
  save(roomName: string, message: Message): Promise<void>;
}
