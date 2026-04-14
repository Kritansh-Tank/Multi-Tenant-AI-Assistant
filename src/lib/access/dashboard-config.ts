import { connectDB } from "../db/connection";
import { DashboardConfig } from "../db/models";

export async function findDashboardConfigByProjectId(projectId: string): Promise<any | null> {
  await connectDB();
  return (await DashboardConfig.findOne({ projectId }).lean()) as unknown as any;
}

export async function updateDashboardConfig(
  projectId: string,
  data: { sections?: any[]; theme?: Record<string, unknown> }
): Promise<any | null> {
  await connectDB();
  const update: Record<string, unknown> = {};
  if (data.sections) update.sections = data.sections;
  if (data.theme) update.theme = data.theme;
  return (await DashboardConfig.findOneAndUpdate(
    { projectId },
    { $set: update },
    { new: true }
  ).lean()) as unknown as any;
}
