import { NextResponse } from "next/server";
import * as authService from "@/lib/services/auth";

export async function GET() {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({
      user: {
        _id: (user as any)._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        projectIds: user.projectIds,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
