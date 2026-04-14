import { NextResponse } from "next/server";
import * as intService from "@/lib/services/integrations";
import { updateIntegrationSchema } from "@/lib/validations";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string } }
) {
  try {
    const integrations = await intService.getIntegrationsForInstance(
      params.instanceId,
      params.projectSlug
    );
    return NextResponse.json({ integrations });
  } catch (error) {
    return errorResponse(error);
  }
}
