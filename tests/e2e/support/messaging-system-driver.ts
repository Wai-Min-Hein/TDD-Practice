import { io, type Socket } from "socket.io-client";

import { MessagingApplication } from "../../../src/messaging-application";
import type {
  Acknowledgement,
  ClientEvents,
  Message,
  ServerEvents,
} from "../../../src/socket/messaging.socket";

export type SeenMessage = Message;
type ParticipantSocket = Socket<ServerEvents, ClientEvents>;
type Participant = { socket: ParticipantSocket; messages: SeenMessage[] };
const TIMEOUT_MS = 2_000;

/**
 * The domain-facing boundary for the acceptance suite.
 *
 * Hides event names, ports, acknowledgements, and connection cleanup.
 */
export class MessagingSystemDriver {
  private application?: MessagingApplication;
  private url?: string;
  private readonly participants = new Map<string, Participant>();

  async start(): Promise<void> {
    this.application = new MessagingApplication();
    this.url = await this.application.start();
  }

  async participantJoinsRoom(
    participantName: string,
    roomName: string,
  ): Promise<void> {
    if (!this.url) throw new Error("Start the messaging system first");

    let participant = this.participants.get(participantName);
    if (!participant) {
      const socket: ParticipantSocket = io(this.url, {
        autoConnect: false,
        reconnection: false,
        timeout: TIMEOUT_MS,
      });
      const messages: SeenMessage[] = [];
      socket.on("message", (message) => messages.push(message));
      participant = { socket, messages };
      this.participants.set(participantName, participant);

      await new Promise<void>((resolve, reject) => {
        socket.once("connect", resolve);
        socket.once("connect_error", reject);
        socket.connect();
      });
    }

    this.checkAcknowledgement(
      await participant.socket.timeout(TIMEOUT_MS).emitWithAck("join-room", {
        participantName,
        roomName,
      }),
    );
  }

  async participantSendsMessage(
    participantName: string,
    text: string,
  ): Promise<void> {
    this.checkAcknowledgement(
      await this.participant(participantName).socket
        .timeout(TIMEOUT_MS)
        .emitWithAck("send-message", { text }),
    );
  }

  async messagesSeenBy(participantName: string): Promise<SeenMessage[]> {
    const { socket, messages } = this.participant(participantName);
    if (messages.length === 0) {
      await new Promise<void>((resolve, reject) => {
        const onMessage = () => {
          clearTimeout(timer);
          resolve();
        };
        const timer = setTimeout(() => {
          socket.off("message", onMessage);
          reject(new Error(`No message received by ${participantName}`));
        }, TIMEOUT_MS);
        socket.once("message", onMessage);
      });
    }
    return [...messages];
  }

  async stop(): Promise<void> {
    for (const { socket } of this.participants.values()) socket.disconnect();
    this.participants.clear();
    await this.application?.stop();
    this.application = undefined;
    this.url = undefined;
  }

  private participant(name: string): Participant {
    const participant = this.participants.get(name);
    if (!participant) throw new Error(`Unknown participant: ${name}`);
    return participant;
  }

  private checkAcknowledgement(result: Acknowledgement): void {
    if (!result.ok) throw new Error(result.error);
  }
}
