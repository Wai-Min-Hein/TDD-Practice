# Messaging TDD Workflow

This project follows London-school (mockist) TDD, outside-in design, and
Ports-and-Adapters architecture.

## The complete cycle

```text
Write one failing E2E acceptance test
              ↓
Build the thinnest walking skeleton
              ↓
Make the E2E test pass
              ↓
Write a unit test for the next collaborator
              ↓
Implement the smallest behavior
              ↓
Refactor
              ↓
Repeat
```

## Step 1: Write the E2E acceptance test (RED)

Start with one simple business scenario in domain language.

```ts
it("delivers a message to another participant in the same room", async () => {
  await system.start();
  await system.participantJoinsRoom("Alice", "general");
  await system.participantJoinsRoom("Bob", "general");

  await system.participantSendsMessage("Alice", "Hello Bob!");

  await expect(system.messagesSeenBy("Bob")).resolves.toContainEqual({
    author: "Alice",
    text: "Hello Bob!",
  });
});
```

The test must fail for a useful reason. Do not write production code before
observing the failure.

The acceptance test is intentionally unaware of Socket.IO event names, ports,
HTTP status codes, or database queries. Those details belong in
`tests/e2e/support/messaging-system-driver.ts`.

## Step 2: Build the walking skeleton

Implement only the thinnest complete technical path:

```text
E2E driver
  → real Socket.IO client
  → Express HTTP server
  → Socket.IO server
  → room join
  → message broadcast
```

At this stage, do not add authentication, validation rules, persistence, or
edge cases unless the happy path needs them.

## Step 3: Make the E2E test GREEN

Run:

```bash
pnpm test:e2e
```

The test should pass using real clients and a real local server. This proves
the application can run through its external boundary from beginning to end.

The current walking skeleton is implemented in:

- `src/app.ts` — Express middleware and HTTP routes
- `src/socket/messaging.socket.ts` — Socket.IO event adapter
- `src/messaging-application.ts` — testable application lifecycle
- `tests/e2e/support/messaging-system-driver.ts` — E2E boundary driver

## Step 4: Write the first unit test (RED)

Move inward from the Socket.IO boundary. Mock only interfaces owned by the
application, not Socket.IO or MongoDB types directly.

Example scenarios:

- A send-message command is translated into a domain message.
- A message is broadcast to every participant in the room.
- A participant can join a room.

The unit test should describe behavior and collaborator messages, not methods.

## Step 5: Implement the smallest behavior (GREEN)

Add the minimum production code needed by the unit test. Define ports from the
perspective of the caller and inject mandatory collaborators through
constructors.

```text
Socket adapter
  → application service
    → domain object
      → owned port
```

Keep third-party APIs behind thin adapters.

## Step 6: Refactor immediately

After the unit test and E2E test are green:

- Remove duplicated responsibilities.
- Rename classes after their real roles.
- Replace primitive-heavy parameters with value types when useful.
- Keep domain code independent of ports, URLs, database clients, and sockets.
- Split classes that require conjunctions such as “and” or “but” to describe.

Run the full suite after each refactoring:

```bash
pnpm typecheck
pnpm test
```

## Current status

- E2E acceptance test: **GREEN**
- Walking skeleton: **complete**
- Unit-test inner loop: **next step**
- Rich domain behavior and message persistence: **not implemented yet**
