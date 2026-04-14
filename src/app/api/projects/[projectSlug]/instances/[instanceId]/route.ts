import { NextResponse } from "next/server";
import * as instanceService from "@/lib/services/product-instances";
import { updateIntegrationsSchema } from "@/lib/validations";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string } }
) {
  try {
    const instance = await instanceService.getInstanceById(
      params.instanceId,
      params.projectSlug
    );
    return NextResponse.json({ instance });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { projectSlug: string; instanceId: string } }
) {
  try {
    const body = await request.json();
    const parsed = updateIntegrationsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR" }, { status: 400 });
    }
    const updated = await instanceService.updateIntegrations(
      params.instanceId,
      params.projectSlug,
      parsed.data
    );
    return NextResponse.json({ instance: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
