import { z } from "zod";

export const createMessageSchema = z.object({
  roomName: z.string().min(1, "room_name_required"),
  author: z.string().min(1, "author_required"),
  text: z.string().min(1, "message_text_required"),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
