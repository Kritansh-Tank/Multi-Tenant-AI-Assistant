import * as intAccess from "../access/integrations";
import * as instanceService from "./product-instances";
import { IIntegration } from "../db/models";

export async function getIntegrationsForInstance(
  instanceId: string,
  projectSlug: string
): Promise<IIntegration[]> {
  await instanceService.getInstanceById(instanceId, projectSlug);
  return intAccess.findIntegrationsByInstanceId(instanceId);
}

export async function toggleIntegration(
  instanceId: string,
  projectSlug: string,
  type: string,
  enabled: boolean
): Promise<IIntegration> {
  await instanceService.getInstanceById(instanceId, projectSlug);
  const updated = await intAccess.updateIntegration(instanceId, type, enabled);
  if (!updated) throw new Error("NOT_FOUND");
  return updated;
}
