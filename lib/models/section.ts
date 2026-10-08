import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISection extends Document {
  key: string;
  displayName: string;
  visible: boolean;
  order: number;
  navLabel: string;
}

const sectionSchema = new Schema<ISection>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["trailhead", "road", "workshop", "research", "capabilities", "vault", "crossroads"],
    },
    displayName: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    navLabel: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Section: Model<ISection> =
  mongoose.models.Section || mongoose.model<ISection>("Section", sectionSchema);
