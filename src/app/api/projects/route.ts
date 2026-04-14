import { NextResponse } from "next/server";
import * as projectService from "@/lib/services/projects";
import { errorResponse } from "@/app/api/_helpers";

export async function GET() {
  try {
    const projects = await projectService.getAllProjectsForUser();
    return NextResponse.json({ projects });
  } catch (error) {
    return errorResponse(error);
  }
}
