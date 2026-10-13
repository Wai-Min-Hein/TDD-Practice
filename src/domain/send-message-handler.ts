import type { MessageBroadcaster } from "../ports/message-broadcaster";

export class SendMessageHandler {
  constructor(private readonly broadcaster: MessageBroadcaster) {}

  handle(command: {
    roomName: string;
    participantName: string;
    text: string;
  }): void {
    this.broadcaster.broadcast(command.roomName, {
      author: command.participantName,
      text: command.text,
    });
  }
}
