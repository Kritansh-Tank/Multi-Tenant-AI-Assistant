import { connectDB } from "../db/connection";
import { ProductInstance } from "../db/models";

export async function findProductInstancesByProjectId(projectId: string): Promise<any[]> {
  await connectDB();
  return (await ProductInstance.find({ projectId }).sort({ createdAt: -1 }).lean()) as unknown as any[];
}

export async function findProductInstanceById(id: string): Promise<any | null> {
  await connectDB();
  return (await ProductInstance.findById(id).lean()) as unknown as any;
}

export async function updateProductInstanceIntegrations(
  id: string,
  integrations: { shopify?: boolean; crm?: boolean }
): Promise<any | null> {
  await connectDB();
  const update: Record<string, boolean> = {};
  if (integrations.shopify !== undefined) update["integrations.shopify"] = integrations.shopify;
  if (integrations.crm !== undefined) update["integrations.crm"] = integrations.crm;
  return (await ProductInstance.findByIdAndUpdate(id, { $set: update }, { new: true }).lean()) as unknown as any;
}
