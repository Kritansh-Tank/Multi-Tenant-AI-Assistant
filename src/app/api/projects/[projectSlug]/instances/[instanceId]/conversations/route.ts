import { NextResponse } from "next/server";
import * as convService from "@/lib/services/conversations";
import { createConversationSchema } from "@/lib/validations";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string } }
) {
  try {
    const conversations = await convService.getConversationsForInstance(
      params.projectSlug,
      params.instanceId
    );
    return NextResponse.json({ conversations });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = createConversationSchema.safeParse(body);
    const title = parsed.success ? parsed.data.title : undefined;
    const conversation = await convService.createConversation(
      params.projectSlug,
      params.instanceId,
      title
    );
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
