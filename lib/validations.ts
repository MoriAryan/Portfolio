import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Profile                                                            */
/* ------------------------------------------------------------------ */

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  displayText: z.string().default(""),
  icon: z.string().default(""),
  visible: z.boolean().default(true),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().default(""),
  heroText: z.string().default(""),
  bio: z.string().default(""),
  currentFocus: z.string().default(""),
  learning: z.string().default(""),
  internshipGoal: z.string().default(""),
  email: z.string().email().or(z.literal("")),
  phone: z.string().default(""),
  avatarUrl: z.string().default(""),
  resumeUrl: z.string().default(""),
  seo: z.object({
    title: z.string().default(""),
    description: z.string().default(""),
    ogImage: z.string().default(""),
  }).default({ title: "", description: "", ogImage: "" }),
  socialLinks: z.array(socialLinkSchema).default([]),
  traveller: z.object({
    enabled: z.boolean().default(false),
  }).default({ enabled: false }),
});

/* ------------------------------------------------------------------ */
/*  Education                                                          */
/* ------------------------------------------------------------------ */

export const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().default(""),
  period: z.string().default(""),
  description: z.string().default(""),
  cgpa: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/*  Experience                                                         */
/* ------------------------------------------------------------------ */

export const experienceSchema = z.object({
  title: z.string().min(1),
  organization: z.string().default(""),
  sponsor: z.string().default(""),
  supervisor: z.string().default(""),
  period: z.string().default(""),
  description: z.array(z.string()).default([]),
  isResearch: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
  researchTopic: z.string().default(""),
  metrics: z.object({
    psnr: z.string().default(""),
    ssim: z.string().default(""),
    datasetSize: z.string().default(""),
    bands: z.string().default(""),
  }).default({ psnr: "", ssim: "", datasetSize: "", bands: "" }),
});

/* ------------------------------------------------------------------ */
/*  Project                                                            */
/* ------------------------------------------------------------------ */

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const projectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1),
  cover: z.string().default(""),
  gallery: z.array(z.string()).default([]),
  hook: z.string().default(""),
  problem: z.string().default(""),
  tech: z.array(z.string()).default([]),
  year: z.string().default(""),
  status: z.string().default("Completed"),
  links: z.array(projectLinkSchema).default([]),
  chapters: z.object({
    howIBuiltIt: z.string().default(""),
    theHardParts: z.string().default(""),
    result: z.string().default(""),
    whatIdChange: z.string().default(""),
  }).default({ howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" }),
  isFeatured: z.boolean().default(false),
  isVault: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/*  Skill                                                              */
/* ------------------------------------------------------------------ */

export const skillItemSchema = z.object({
  name: z.string().min(1),
  isTopSkill: z.boolean().default(false),
  projectSlugs: z.array(z.string()).default([]),
});

export const skillSchema = z.object({
  category: z.string().min(1),
  items: z.array(skillItemSchema).default([]),
  icon: z.string().default("code"),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/*  Achievement                                                        */
/* ------------------------------------------------------------------ */

export const achievementSchema = z.object({
  title: z.string().min(1),
  result: z.string().default(""),
  year: z.string().default(""),
  timelineDate: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/*  Position                                                           */
/* ------------------------------------------------------------------ */

export const positionSchema = z.object({
  title: z.string().min(1),
  organization: z.string().default(""),
  description: z.string().default(""),
  since: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

export const timelineSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  date: z.string().default(""),
  category: z.enum(["education", "achievement", "position", "hackathon", "research", "milestone"]).default("milestone"),
  linkedEntityType: z.string().default(""),
  linkedEntityId: z.string().default(""),
  icon: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const sectionSchema = z.object({
  key: z.enum(["trailhead", "road", "workshop", "research", "capabilities", "vault", "crossroads"]),
  displayName: z.string().min(1),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
  navLabel: z.string().default(""),
});

/* ------------------------------------------------------------------ */
/*  Reorder (generic for drag-and-drop)                                */
/* ------------------------------------------------------------------ */

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)),
});

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
