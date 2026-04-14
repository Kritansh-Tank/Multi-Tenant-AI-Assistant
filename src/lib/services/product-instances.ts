import * as instanceAccess from "../access/product-instances";
import * as projectService from "./projects";
import * as authService from "./auth";
import { IProductInstance } from "../db/models";

export async function getInstancesForProject(
  projectSlug: string
): Promise<IProductInstance[]> {
  const project = await projectService.getProjectForUser(projectSlug);
  return instanceAccess.findProductInstancesByProjectId((project as any)._id.toString());
}

export async function getInstanceById(
  instanceId: string,
  projectSlug: string
): Promise<IProductInstance> {
  const project = await projectService.getProjectForUser(projectSlug);
  const instance = await instanceAccess.findProductInstanceById(instanceId);
  if (!instance) throw new Error("NOT_FOUND");
  if (instance.projectId.toString() !== (project as any)._id.toString()) {
    throw new Error("FORBIDDEN");
  }
  return instance;
}

export async function updateIntegrations(
  instanceId: string,
  projectSlug: string,
  integrations: { shopify?: boolean; crm?: boolean }
): Promise<IProductInstance> {
  await getInstanceById(instanceId, projectSlug);
  const updated = await instanceAccess.updateProductInstanceIntegrations(
    instanceId,
    integrations
  );
  if (!updated) throw new Error("NOT_FOUND");
  return updated;
}
