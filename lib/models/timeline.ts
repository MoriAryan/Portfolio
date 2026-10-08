import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITimeline extends Document {
  title: string;
  description: string;
  date: string;
  category: string;
  linkedEntityType: string;
  linkedEntityId: mongoose.Types.ObjectId | null;
  icon: string;
  order: number;
  published: boolean;
}

const timelineSchema = new Schema<ITimeline>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: String, default: "" },
    category: {
      type: String,
      enum: ["education", "achievement", "position", "hackathon", "research", "milestone"],
      default: "milestone",
    },
    linkedEntityType: { type: String, default: "" },
    linkedEntityId: { type: Schema.Types.ObjectId, default: null },
    icon: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Timeline: Model<ITimeline> =
  mongoose.models.Timeline || mongoose.model<ITimeline>("Timeline", timelineSchema);
