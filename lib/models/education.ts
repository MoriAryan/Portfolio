import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree: string;
  period: string;
  description: string;
  cgpa: string;
  order: number;
  published: boolean;
}

const educationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true },
    degree: { type: String, default: "" },
    period: { type: String, default: "" },
    description: { type: String, default: "" },
    cgpa: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Education: Model<IEducation> =
  mongoose.models.Education || mongoose.model<IEducation>("Education", educationSchema);
