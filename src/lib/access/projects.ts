import { connectDB } from "../db/connection";
import { Project } from "../db/models";

export async function findAllProjects(): Promise<any[]> {
  await connectDB();
  return (await Project.find().sort({ createdAt: -1 }).lean()) as unknown as any[];
}

export async function findProjectBySlug(slug: string): Promise<any | null> {
  await connectDB();
  return (await Project.findOne({ slug }).lean()) as unknown as any;
}

export async function findProjectById(id: string): Promise<any | null> {
  await connectDB();
  return (await Project.findById(id).lean()) as unknown as any;
}
