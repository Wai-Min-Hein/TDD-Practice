# Socket TDD

A Node.js, Express, TypeScript, WebSocket, and Socket.IO messaging project grown
outside-in using London-school TDD and object-oriented design.

## Run locally

Use Node.js 22 or newer and the pnpm version specified in `package.json`.

```bash
pnpm install
pnpm start
```

The server listens at `http://127.0.0.1:3000`. Set `PORT` in the environment or
in an optional `.env` file to change the port. Messages are delivered live in
memory; this feature does not require MongoDB.

## Room messaging

Participants join one room per connection. Sending a message delivers
`{ author, text }` to everyone in that room, including the sender. Joining a new
room leaves the previous room. Messages are not stored for later delivery.

Connect using a Socket.IO client:

```ts
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000");
socket.on("message", (message) => console.log(message));

socket.on("connect", async () => {
  await socket.timeout(2000).emitWithAck("join-room", {
    participantName: "Alice",
    roomName: "general",
  });
  await socket.timeout(2000).emitWithAck("send-message", { text: "Hello!" });
});
```

Both commands acknowledge with `{ ok: true }`. Sending before joining a room
returns `{ ok: false, error: "Join a room before sending a message" }`.

## Verification

```bash
pnpm typecheck
pnpm test
```

The acceptance suite uses a real server on an ephemeral port and real Socket.IO
clients. It covers delivery, room isolation, and switching rooms. The
`MessagingSystemDriver` keeps transport details out of the scenarios.

See [TDD-WORKFLOW.md](TDD-WORKFLOW.md) for the outside-in development workflow.
