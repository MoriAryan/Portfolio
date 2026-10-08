import mongoose, { Schema, type Document, type Model } from "mongoose";

/* ---------- Sub-schemas ---------- */

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    displayText: { type: String, default: "" },
    icon: { type: String, default: "" },
    visible: { type: Boolean, default: true },
  },
  { _id: false }
);

const seoSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
  { _id: false }
);

const travellerSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
  },
  { _id: false }
);

/* ---------- Main Profile schema ---------- */

export interface IProfile extends Document {
  name: string;
  role: string;
  heroText: string;
  bio: string;
  currentFocus: string;
  learning: string;
  internshipGoal: string;
  email: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
  seo: { title: string; description: string; ogImage: string };
  socialLinks: {
    platform: string;
    url: string;
    displayText: string;
    icon: string;
    visible: boolean;
  }[];
  traveller: { enabled: boolean };
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    heroText: { type: String, default: "" },
    bio: { type: String, default: "" },
    currentFocus: { type: String, default: "" },
    learning: { type: String, default: "" },
    internshipGoal: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    seo: { type: seoSchema, default: () => ({}) },
    socialLinks: { type: [socialLinkSchema], default: [] },
    traveller: { type: travellerSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", profileSchema);
