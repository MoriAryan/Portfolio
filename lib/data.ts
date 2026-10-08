import { connectDB } from "./db";
import {
  Profile,
  Education,
  Experience,
  Project,
  Skill,
  Achievement,
  Position,
  Timeline,
  Section,
} from "./models";
import {
  FALLBACK_PROFILE,
  FALLBACK_EXPERIENCES,
  FALLBACK_PROJECTS,
  FALLBACK_SKILLS,
  FALLBACK_ACHIEVEMENTS,
  FALLBACK_SECTIONS,
} from "./seed-data";

/**
 * Server-side data fetchers for public pages.
 * Each function tries MongoDB first, falls back to static seed data.
 * All functions return plain objects (via .lean() + JSON parse).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPlain<T>(doc: T): any {
  return JSON.parse(JSON.stringify(doc));
}

export async function getProfile() {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();
    if (profile) return toPlain(profile);
  } catch (e) {
    console.error("getProfile DB error:", e);
  }
  return FALLBACK_PROFILE;
}

export async function getEducation() {
  try {
    await connectDB();
    const items = await Education.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getEducation DB error:", e);
  }
  return [];
}

export async function getExperiences() {
  try {
    await connectDB();
    const items = await Experience.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getExperiences DB error:", e);
  }
  return toPlain(FALLBACK_EXPERIENCES);
}

export async function getFeaturedProjects() {
  try {
    await connectDB();
    const items = await Project.find({ published: true, isFeatured: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getFeaturedProjects DB error:", e);
  }
  return toPlain(FALLBACK_PROJECTS.filter((p) => p.isFeatured));
}

export async function getVaultProjects() {
  try {
    await connectDB();
    const items = await Project.find({ published: true, isVault: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getVaultProjects DB error:", e);
  }
  return toPlain(FALLBACK_PROJECTS.filter((p) => p.isVault));
}

export async function getAllProjects() {
  try {
    await connectDB();
    const items = await Project.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getAllProjects DB error:", e);
  }
  return toPlain(FALLBACK_PROJECTS);
}

export async function getSkills() {
  try {
    await connectDB();
    const items = await Skill.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getSkills DB error:", e);
  }
  return toPlain(FALLBACK_SKILLS);
}

export async function getAchievements() {
  try {
    await connectDB();
    const items = await Achievement.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getAchievements DB error:", e);
  }
  return toPlain(FALLBACK_ACHIEVEMENTS);
}

export async function getPositions() {
  try {
    await connectDB();
    const items = await Position.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getPositions DB error:", e);
  }
  return [];
}

export async function getTimeline() {
  try {
    await connectDB();
    const items = await Timeline.find({ published: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getTimeline DB error:", e);
  }
  return [];
}

export async function getSections() {
  try {
    await connectDB();
    const items = await Section.find({ visible: true }).sort({ order: 1 }).lean();
    if (items.length) return toPlain(items);
  } catch (e) {
    console.error("getSections DB error:", e);
  }
  return toPlain(FALLBACK_SECTIONS);
}

export async function getResearchExperience() {
  try {
    await connectDB();
    const item = await Experience.findOne({ published: true, isResearch: true }).lean();
    if (item) return toPlain(item);
  } catch (e) {
    console.error("getResearchExperience DB error:", e);
  }
  return toPlain(FALLBACK_EXPERIENCES.find((e) => e.isResearch) || null);
}
