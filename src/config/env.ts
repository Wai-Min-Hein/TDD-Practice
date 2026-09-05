import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.url({ protocol: /^mongodb(\+srv)?$/ }),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(16).default("development-secret-change-me"),
});

export const env = envSchema.parse(process.env);
