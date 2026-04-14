import { NextResponse } from "next/server";
import * as dashService from "@/lib/services/dashboard-config";
import { updateDashboardConfigSchema } from "@/lib/validations";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string } }
) {
  try {
    const config = await dashService.getDashboardConfig(params.projectSlug);
    return NextResponse.json({ config });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { projectSlug: string } }
) {
  try {
    const body = await request.json();
    const parsed = updateDashboardConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 400 });
    }
    const config = await dashService.updateDashboardConfig(params.projectSlug, parsed.data);
    return NextResponse.json({ config });
  } catch (error) {
    return errorResponse(error);
  }
}
