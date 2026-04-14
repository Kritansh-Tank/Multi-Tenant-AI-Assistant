import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validations";
import * as userAccess from "@/lib/access/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 400 });
    }

    const user = await userAccess.findUserById(parsed.data.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cookieStore = cookies();
    cookieStore.set("session_user_id", (user as any)._id.toString(), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

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
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
