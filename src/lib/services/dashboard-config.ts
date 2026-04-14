import * as dashAccess from "../access/dashboard-config";
import * as projectService from "./projects";
import * as authService from "./auth";
import { IDashboardConfig, ISection } from "../db/models";

export async function getDashboardConfig(
  projectSlug: string
): Promise<IDashboardConfig> {
  const user = await authService.requireUser();
  await authService.requireAdmin(user);
  const project = await projectService.getProjectBySlug(projectSlug);
  await authService.requireProjectAccess(user, (project as any)._id.toString());
  const config = await dashAccess.findDashboardConfigByProjectId(
    (project as any)._id.toString()
  );
  if (!config) throw new Error("NOT_FOUND");
  return config;
}

export async function updateDashboardConfig(
  projectSlug: string,
  data: { sections?: ISection[]; theme?: Record<string, unknown> }
): Promise<IDashboardConfig> {
  const user = await authService.requireUser();
  await authService.requireAdmin(user);
  const project = await projectService.getProjectBySlug(projectSlug);
  await authService.requireProjectAccess(user, (project as any)._id.toString());
  const updated = await dashAccess.updateDashboardConfig(
    (project as any)._id.toString(),
    data
  );
  if (!updated) throw new Error("NOT_FOUND");
  return updated;
}
