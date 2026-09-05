import { Document, model, Schema } from "mongoose";

export interface AuthUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
}

const schema = new Schema<AuthUserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });

export const AuthUser = model<AuthUserDocument>("AuthUser", schema);
