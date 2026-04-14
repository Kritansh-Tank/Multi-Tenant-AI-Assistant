import * as projectAccess from "../access/projects";
import * as authService from "./auth";
import { IProject } from "../db/models";

export async function getProjectBySlug(slug: string): Promise<IProject> {
  const project = await projectAccess.findProjectBySlug(slug);
  if (!project) throw new Error("NOT_FOUND");
  return project;
}

export async function getProjectForUser(slug: string): Promise<IProject> {
  const user = await authService.requireUser();
  const project = await getProjectBySlug(slug);
  await authService.requireProjectAccess(user, (project as any)._id.toString());
  return project;
}

export async function getAllProjectsForUser(): Promise<IProject[]> {
  const user = await authService.requireUser();
  const allProjects = await projectAccess.findAllProjects();
  return allProjects.filter((p: any) =>
    user.projectIds.some((pid: any) => pid.toString() === p._id.toString())
  );
}
