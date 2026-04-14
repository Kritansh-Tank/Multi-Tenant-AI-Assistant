import { cookies } from "next/headers";
import * as userAccess from "../access/users";
import { IUser } from "../db/models";

export async function getCurrentUser(): Promise<IUser | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session_user_id");
  if (!sessionCookie?.value) return null;
  return userAccess.findUserById(sessionCookie.value);
}

export async function requireUser(): Promise<IUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireProjectAccess(user: IUser, projectId: string): Promise<void> {
  const hasAccess = user.projectIds.some(
    (pid: any) => pid.toString() === projectId.toString()
  );
  if (!hasAccess) throw new Error("FORBIDDEN");
}

export async function requireAdmin(user: IUser): Promise<void> {
  if (user.role !== "admin") throw new Error("FORBIDDEN");
}
