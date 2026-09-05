import { Document, model, Schema } from "mongoose";

export interface MessageDocument extends Document {
  roomName: string;
  author: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    roomName: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Message = model<MessageDocument>("Message", messageSchema);
