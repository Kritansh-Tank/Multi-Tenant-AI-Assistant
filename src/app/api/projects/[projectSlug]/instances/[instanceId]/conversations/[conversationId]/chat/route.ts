import { NextResponse } from "next/server";
import * as aiService from "@/lib/services/ai";
import { sendMessageSchema } from "@/lib/validations";
import { errorResponse } from "@/app/api/_helpers";

export async function POST(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string; conversationId: string } }
) {
  try {
    const body = await request.json();
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 400 });
    }

    const messages = await aiService.processChat({
      conversationId: params.conversationId,
      projectSlug: params.projectSlug,
      instanceId: params.instanceId,
      userMessage: parsed.data.content,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return errorResponse(error);
  }
}
