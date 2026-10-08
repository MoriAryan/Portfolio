import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  result: string;
  year: string;
  timelineDate: string;
  order: number;
  published: boolean;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    result: { type: String, default: "" },
    year: { type: String, default: "" },
    timelineDate: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Achievement: Model<IAchievement> =
  mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", achievementSchema);
