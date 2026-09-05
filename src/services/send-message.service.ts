import type { Message } from "../ports/message-broadcaster";
import type { MessageBroadcaster } from "../ports/message-broadcaster";
import type { MessageRepository } from "../ports/message-repository";

export interface SendMessageCommand {
  roomName: string;
  participantName: string;
  text: string;
}

export class SendMessageService {
  constructor(
    private readonly repository: MessageRepository,
    private readonly broadcaster: MessageBroadcaster,
  ) {}

  async send(command: SendMessageCommand): Promise<void> {
    const message: Message = { author: command.participantName, text: command.text };
    await this.repository.save(command.roomName, message);
    this.broadcaster.broadcast(command.roomName, message);
  }
}
