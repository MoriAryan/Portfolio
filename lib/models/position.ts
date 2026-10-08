import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPosition extends Document {
  title: string;
  organization: string;
  description: string;
  since: string;
  order: number;
  published: boolean;
}

const positionSchema = new Schema<IPosition>(
  {
    title: { type: String, required: true },
    organization: { type: String, default: "" },
    description: { type: String, default: "" },
    since: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Position: Model<IPosition> =
  mongoose.models.Position || mongoose.model<IPosition>("Position", positionSchema);
