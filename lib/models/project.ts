import mongoose, { Schema, type Document, type Model } from "mongoose";

const linkSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const chaptersSchema = new Schema(
  {
    howIBuiltIt: { type: String, default: "" },
    theHardParts: { type: String, default: "" },
    result: { type: String, default: "" },
    whatIdChange: { type: String, default: "" },
  },
  { _id: false }
);

export interface IProject extends Document {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  hook: string;
  problem: string;
  tech: string[];
  year: string;
  status: string;
  links: { label: string; url: string }[];
  chapters: {
    howIBuiltIt: string;
    theHardParts: string;
    result: string;
    whatIdChange: string;
  };
  isFeatured: boolean;
  isVault: boolean;
  order: number;
  published: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    cover: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    hook: { type: String, default: "" },
    problem: { type: String, default: "" },
    tech: { type: [String], default: [] },
    year: { type: String, default: "" },
    status: { type: String, default: "Completed" },
    links: { type: [linkSchema], default: [] },
    chapters: { type: chaptersSchema, default: () => ({}) },
    isFeatured: { type: Boolean, default: false },
    isVault: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for quick queries
projectSchema.index({ published: 1, isFeatured: 1 });
projectSchema.index({ published: 1, isVault: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
