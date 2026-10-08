import mongoose, { Schema, type Document, type Model } from "mongoose";

const metricsSchema = new Schema(
  {
    psnr: { type: String, default: "" },
    ssim: { type: String, default: "" },
    datasetSize: { type: String, default: "" },
    bands: { type: String, default: "" },
  },
  { _id: false }
);

export interface IExperience extends Document {
  title: string;
  organization: string;
  sponsor: string;
  supervisor: string;
  period: string;
  description: string[];
  isResearch: boolean;
  order: number;
  published: boolean;
  researchTopic: string;
  metrics: { psnr: string; ssim: string; datasetSize: string; bands: string };
}

const experienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    organization: { type: String, default: "" },
    sponsor: { type: String, default: "" },
    supervisor: { type: String, default: "" },
    period: { type: String, default: "" },
    description: { type: [String], default: [] },
    isResearch: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    researchTopic: { type: String, default: "" },
    metrics: { type: metricsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>("Experience", experienceSchema);
