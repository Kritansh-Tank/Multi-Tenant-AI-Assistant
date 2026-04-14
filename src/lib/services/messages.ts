import * as msgAccess from "../access/messages";
import * as convService from "./conversations";
import { IMessage } from "../db/models";

export async function getMessagesForConversation(
  conversationId: string,
  projectSlug: string
): Promise<IMessage[]> {
  await convService.getConversationById(conversationId, projectSlug);
  return msgAccess.findMessagesByConversationId(conversationId);
}

export async function addMessage(
  conversationId: string,
  projectSlug: string,
  role: "user" | "assistant" | "step",
  content: string,
  metadata?: Record<string, unknown>
): Promise<IMessage> {
  await convService.getConversationById(conversationId, projectSlug);
  return msgAccess.createMessage({ conversationId, role, content, metadata });
}
