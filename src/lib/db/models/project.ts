import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
