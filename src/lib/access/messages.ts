import { connectDB } from "../db/connection";
import { Message } from "../db/models";
import { MessageRole } from "../db/models/message";

export async function findMessagesByConversationId(conversationId: string): Promise<any[]> {
  await connectDB();
  return (await Message.find({ conversationId }).sort({ createdAt: 1 }).lean()) as unknown as any[];
}

export async function createMessage(data: {
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
}): Promise<any> {
  await connectDB();
  return Message.create(data);
}
