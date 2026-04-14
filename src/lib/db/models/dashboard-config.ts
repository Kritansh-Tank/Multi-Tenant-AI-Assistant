import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type WidgetType = "stats-card" | "chart" | "recent-activity" | "list" | "metric-bar";

export interface IWidget {
  id: string;
  type: WidgetType;
  title: string;
  order: number;
  config: Record<string, unknown>;
}

export interface ISection {
  id: string;
  title: string;
  order: number;
  columns: number;
  widgets: IWidget[];
}

export interface IDashboardConfig extends Document {
  projectId: Types.ObjectId;
  sections: ISection[];
  theme: {
    accentColor: string;
    showWelcomeBanner: boolean;
    welcomeMessage: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WidgetSchema = new Schema<IWidget>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["stats-card", "chart", "recent-activity", "list", "metric-bar"],
      required: true,
    },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    columns: { type: Number, default: 2 },
    widgets: [WidgetSchema],
  },
  { _id: false }
);

const DashboardConfigSchema = new Schema<IDashboardConfig>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
    sections: [SectionSchema],
    theme: {
      accentColor: { type: String, default: "#3b82f6" },
      showWelcomeBanner: { type: Boolean, default: true },
      welcomeMessage: { type: String, default: "Welcome to your dashboard" },
    },
  },
  { timestamps: true }
);

export const DashboardConfig: Model<IDashboardConfig> =
  mongoose.models.DashboardConfig ||
  mongoose.model<IDashboardConfig>("DashboardConfig", DashboardConfigSchema);
