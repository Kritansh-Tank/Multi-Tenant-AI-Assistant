import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type MessageRole = "user" | "assistant" | "step";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: { type: String, enum: ["user", "assistant", "step"], required: true },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
