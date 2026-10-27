# Project Structure

This project is a TypeScript messaging service using Express and Socket.IO.
It is grown outside-in using the workflow in `TDD-WORKFLOW.md`.

```text
.
|-- main.ts
|-- src/
|   |-- app.ts
|   |-- messaging-application.ts
|   `-- socket/
|       `-- messaging.socket.ts
|-- tests/
|   `-- e2e/
|       |-- messaging.test.ts
|       `-- support/
|           `-- messaging-system-driver.ts
|-- package.json
|-- pnpm-lock.yaml
|-- tsconfig.json
`-- vitest.config.ts
```

## Responsibilities

- `main.ts` starts the application and handles shutdown signals.
- `src/app.ts` creates the Express application.
- `src/messaging-application.ts` owns the HTTP and Socket.IO server lifecycle.
  Tests use an ephemeral port so they do not depend on an existing server.
- `src/socket/messaging.socket.ts` defines the event contract, records room
  membership per connection, and broadcasts messages to the current room.
- `tests/e2e/messaging.test.ts` describes delivery, isolation, and room switching
  in domain language.
- `tests/e2e/support/messaging-system-driver.ts` manages real clients, event
  acknowledgements, received messages, and cleanup.

## Message flow

```text
Socket.IO client
  -> join-room { participantName, roomName }
  -> send-message { text }
  -> message { author, text } to all connections in the room
```

Each connection belongs to one messaging room at a time. Room names use an
internal prefix to keep them separate from Socket.IO connection identifiers.
There is no message persistence or authentication yet.

## Commands

```bash
pnpm install
pnpm start       # Start the server (PORT defaults to 3000)
pnpm dev         # Restart the server when source files change
pnpm test        # Run the full test suite
pnpm test:e2e    # Run the acceptance suite
pnpm typecheck   # Check TypeScript without emitting files
```
