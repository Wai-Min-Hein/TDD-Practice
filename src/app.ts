import express from "express";
import { authRouter } from "./routes/auth";

export const app = express();

app.use(express.json());
app.get("/", (_request, response) => {
  response.json({ isSuccess: true, status: "ok" });
});
app.use("/api/v1/auth", authRouter);
