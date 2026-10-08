import mongoose, { Schema, type Document, type Model } from "mongoose";

const skillItemSchema = new Schema(
  {
    name: { type: String, required: true },
    isTopSkill: { type: Boolean, default: false },
    projectSlugs: { type: [String], default: [] },
  },
  { _id: false }
);

export interface ISkill extends Document {
  category: string;
  items: { name: string; isTopSkill: boolean; projectSlugs: string[] }[];
  icon: string;
  order: number;
  published: boolean;
}

const skillSchema = new Schema<ISkill>(
  {
    category: { type: String, required: true },
    items: { type: [skillItemSchema], default: [] },
    icon: { type: String, default: "code" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", skillSchema);
