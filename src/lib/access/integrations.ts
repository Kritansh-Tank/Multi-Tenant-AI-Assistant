import { connectDB } from "../db/connection";
import { Integration } from "../db/models";

export async function findIntegrationsByInstanceId(productInstanceId: string): Promise<any[]> {
  await connectDB();
  return (await Integration.find({ productInstanceId }).lean()) as unknown as any[];
}

export async function updateIntegration(
  productInstanceId: string,
  type: string,
  enabled: boolean
): Promise<any | null> {
  await connectDB();
  return (await Integration.findOneAndUpdate(
    { productInstanceId, type },
    { $set: { enabled } },
    { new: true }
  ).lean()) as unknown as any;
}
