import * as convAccess from "../access/conversations";
import * as projectService from "./projects";
import * as authService from "./auth";
import { IConversation } from "../db/models";

export async function getConversationsForInstance(
  projectSlug: string,
  instanceId: string
): Promise<IConversation[]> {
  const project = await projectService.getProjectForUser(projectSlug);
  return convAccess.findConversationsByInstanceId(
    instanceId,
    (project as any)._id.toString()
  );
}

export async function getConversationById(
  conversationId: string,
  projectSlug: string
): Promise<IConversation> {
  const project = await projectService.getProjectForUser(projectSlug);
  const conversation = await convAccess.findConversationById(conversationId);
  if (!conversation) throw new Error("NOT_FOUND");
  if (conversation.projectId.toString() !== (project as any)._id.toString()) {
    throw new Error("FORBIDDEN");
  }
  return conversation;
}

export async function createConversation(
  projectSlug: string,
  instanceId: string,
  title?: string
): Promise<IConversation> {
  const user = await authService.requireUser();
  const project = await projectService.getProjectForUser(projectSlug);
  return convAccess.createConversation({
    projectId: (project as any)._id.toString(),
    productInstanceId: instanceId,
    userId: (user as any)._id.toString(),
    title: title || "New Conversation",
  });
}
