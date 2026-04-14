import { NextResponse } from "next/server";
import * as msgService from "@/lib/services/messages";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string; conversationId: string } }
) {
  try {
    const messages = await msgService.getMessagesForConversation(
      params.conversationId,
      params.projectSlug
    );
    return NextResponse.json({ messages });
  } catch (error) {
    return errorResponse(error);
  }
}
