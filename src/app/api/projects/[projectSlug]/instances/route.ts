import { NextResponse } from "next/server";
import * as instanceService from "@/lib/services/product-instances";
import { errorResponse } from "@/app/api/_helpers";

export async function GET(
  request: Request,
  { params }: { params: { projectSlug: string } }
) {
  try {
    const instances = await instanceService.getInstancesForProject(params.projectSlug);
    return NextResponse.json({ instances });
  } catch (error) {
    return errorResponse(error);
  }
}
