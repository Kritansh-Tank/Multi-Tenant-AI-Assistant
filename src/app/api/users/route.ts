import { NextResponse } from "next/server";
import * as userAccess from "@/lib/access/users";

export async function GET() {
  try {
    const users = await userAccess.findAllUsers();
    return NextResponse.json({
      users: users.map((u: any) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        projectIds: u.projectIds,
      })),
    });
  } catch {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
