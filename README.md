# Socket TDD

A Node.js, Express, TypeScript, WebSocket, and Socket.IO messaging project grown
outside-in using London-school TDD and object-oriented design.

## Local configuration

Copy `.env.example` to `.env`. The local setup uses:

```env
MONGODB_URI=mongodb://localhost:27017/socket-tdd
```

MongoDB must be running before starting the application:

```bash
brew services start mongodb-community@8.0
pnpm start
```

## Current step: 1 — write the failing E2E acceptance test

The first happy-path behavior is:

> A message sent by one participant is delivered to another participant in the
> same room.

The acceptance test speaks only in domain terms. `MessagingSystemDriver` is the
boundary that will hide ports, Socket.IO events, acknowledgements, and process
lifecycle details.

### Run this step

```bash
pnpm install
pnpm test:e2e
```

Expected result: **RED** with this diagnostic:

```text
Messaging application is not connected yet; build the walking skeleton next
```

That failure is intentional. It proves the acceptance test runs and fails for
the missing application, not because of an unclear assertion or test setup.

## TDD notebook (not implemented yet)

- Connect the E2E system driver to a real application boundary.
- Establish the smallest Express + Socket.IO walking skeleton.
- Catch the room-join event at the boundary and discover collaborators outside-in.
- Catch the send-message event and deliver it to room participants.
- Add failures and boundary cases only after the happy path is green.
