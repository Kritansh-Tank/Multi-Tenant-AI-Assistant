import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ProductType = "sales-assistant" | "support-bot";

export interface IProductInstance extends Document {
  projectId: Types.ObjectId;
  name: string;
  productType: ProductType;
  description: string;
  integrations: {
    shopify: boolean;
    crm: boolean;
  };
  config: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductInstanceSchema = new Schema<IProductInstance>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    name: { type: String, required: true },
    productType: { type: String, enum: ["sales-assistant", "support-bot"], required: true },
    description: { type: String, default: "" },
    integrations: {
      shopify: { type: Boolean, default: false },
      crm: { type: Boolean, default: false },
    },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ProductInstance: Model<IProductInstance> =
  mongoose.models.ProductInstance ||
  mongoose.model<IProductInstance>("ProductInstance", ProductInstanceSchema);
