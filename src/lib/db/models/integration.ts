import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type IntegrationType = "shopify" | "crm";

export interface IIntegration extends Document {
  productInstanceId: Types.ObjectId;
  type: IntegrationType;
  enabled: boolean;
  mockData: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    productInstanceId: {
      type: Schema.Types.ObjectId,
      ref: "ProductInstance",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["shopify", "crm"], required: true },
    enabled: { type: Boolean, default: false },
    mockData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

IntegrationSchema.index({ productInstanceId: 1, type: 1 }, { unique: true });

export const Integration: Model<IIntegration> =
  mongoose.models.Integration || mongoose.model<IIntegration>("Integration", IntegrationSchema);
