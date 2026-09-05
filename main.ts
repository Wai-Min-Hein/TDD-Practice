import { createServer } from "node:http";
import { Server } from "socket.io";
import { app } from "./src/app";
import { connectDatabase } from "./src/config/database";
import { env } from "./src/config/env";
import { MongoMessageRepository } from "./src/repositories/mongo-message.repository";
import { registerMessagingSocket } from "./src/socket/messaging.socket";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const httpServer = createServer(app);
  const socketServer = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGIN, credentials: true },
  });

  registerMessagingSocket(socketServer, new MongoMessageRepository());

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

void startServer();
