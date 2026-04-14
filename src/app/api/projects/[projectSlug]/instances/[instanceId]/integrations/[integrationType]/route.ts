import { NextResponse } from "next/server";
import * as intService from "@/lib/services/integrations";
import { updateIntegrationSchema } from "@/lib/validations";
import { errorResponse } from "@/app/api/_helpers";

export async function PATCH(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string; integrationType: string } }
) {
  try {
    const body = await request.json();
    const parsed = updateIntegrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR" }, { status: 400 });
    }
    const integration = await intService.toggleIntegration(
      params.instanceId,
      params.projectSlug,
      params.integrationType,
      parsed.data.enabled
    );
    return NextResponse.json({ integration });
  } catch (error) {
    return errorResponse(error);
  }
}
