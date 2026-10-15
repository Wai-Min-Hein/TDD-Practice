import "dotenv/config";

import { MessagingApplication } from "./src/messaging-application";

const application = new MessagingApplication();

try {
  const url = await application.start(Number(process.env.PORT ?? 3000));
  console.log(`Messaging server listening at ${url}`);
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      void application.stop();
    });
  }
} catch (error) {
  console.error("Unable to start messaging server:", error);
  process.exitCode = 1;
}
