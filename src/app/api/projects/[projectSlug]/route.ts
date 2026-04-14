import { NextResponse } from "next/server";
import * as projectService from "@/lib/services/projects";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string } }
) {
  try {
    const project = await projectService.getProjectForUser(params.projectSlug);
    return NextResponse.json({ project });
  } catch (error) {
    return errorResponse(error);
  }
}
