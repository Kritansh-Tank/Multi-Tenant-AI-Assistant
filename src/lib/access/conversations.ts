import { connectDB } from "../db/connection";
import { Conversation } from "../db/models";

export async function findConversationsByInstanceId(
  productInstanceId: string,
  projectId: string
): Promise<any[]> {
  await connectDB();
  return (await Conversation.find({ productInstanceId, projectId })
    .sort({ updatedAt: -1 })
    .lean()) as unknown as any[];
}

export async function findConversationById(id: string): Promise<any | null> {
  await connectDB();
  return (await Conversation.findById(id).lean()) as unknown as any;
}

export async function createConversation(data: {
  projectId: string;
  productInstanceId: string;
  userId: string;
  title?: string;
}): Promise<any> {
  await connectDB();
  return Conversation.create(data);
}
