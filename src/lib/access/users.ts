import { connectDB } from "../db/connection";
import { User } from "../db/models";

export async function findUserById(id: string): Promise<any | null> {
  await connectDB();
  return (await User.findById(id).lean()) as unknown as any;
}

export async function findUsersByProjectId(projectId: string): Promise<any[]> {
  await connectDB();
  return (await User.find({ projectIds: projectId }).lean()) as unknown as any[];
}

export async function findAllUsers(): Promise<any[]> {
  await connectDB();
  return (await User.find().lean()) as unknown as any[];
}
