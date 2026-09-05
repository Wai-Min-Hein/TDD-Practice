export type Message = Readonly<{
  author: string;
  text: string;
}>;

export interface MessageBroadcaster {
  broadcast(roomName: string, message: Message): void;
}
