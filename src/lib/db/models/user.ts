import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type UserRole = "admin" | "member";

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  projectIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    avatar: { type: String },
    projectIds: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
