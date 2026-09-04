export type SeenMessage = Readonly<{
  author: string;
  text: string;
}>;

/**
 * The domain-facing boundary for the acceptance suite.
 *
 * Socket.IO event names, ports, acknowledgements, and connection cleanup belong
 * behind this API. They will be introduced while growing the walking skeleton.
 */
export class MessagingSystemDriver {
  async start(): Promise<void> {
    throw new Error("Walking skeleton not implemented yet");
  }

  async participantJoinsRoom(
    _participantName: string,
    _roomName: string,
  ): Promise<void> {
    throw new Error("Walking skeleton not implemented yet");
  }

  async participantSendsMessage(
    _participantName: string,
    _text: string,
  ): Promise<void> {
    throw new Error("Walking skeleton not implemented yet");
  }

  async messagesSeenBy(_participantName: string): Promise<SeenMessage[]> {
    throw new Error("Walking skeleton not implemented yet");
  }

  async stop(): Promise<void> {
  }
}
