import { NextResponse } from "next/server";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "INTERNAL_ERROR";
  const statusMap: Record<string, number> = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
  };
  const status = statusMap[message] || 500;
  return NextResponse.json({ error: message }, { status });
}

export { errorResponse };
