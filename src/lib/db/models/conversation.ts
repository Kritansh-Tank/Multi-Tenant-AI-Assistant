import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IConversation extends Document {
  projectId: Types.ObjectId;
  productInstanceId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    productInstanceId: {
      type: Schema.Types.ObjectId,
      ref: "ProductInstance",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Conversation" },
  },
  { timestamps: true }
);

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
