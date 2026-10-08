/**
 * Idempotent seed script — safe to run multiple times.
 * Uses upsert on unique keys so it never creates duplicates.
 *
 * Run: npx tsx scripts/seed.ts
 */

import mongoose from "mongoose";
import { config } from "dotenv";
config({ path: ".env.local" });

// Import all models to register them
import { Profile } from "../lib/models/profile";
import { Education } from "../lib/models/education";
import { Experience } from "../lib/models/experience";
import { Project } from "../lib/models/project";
import { Skill } from "../lib/models/skill";
import { Achievement } from "../lib/models/achievement";
import { Position } from "../lib/models/position";
import { Timeline } from "../lib/models/timeline";
import { Section } from "../lib/models/section";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env.local");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected\n");

  /* ---------------------------------------------------------------- */
  /*  Profile (singleton — upsert)                                     */
  /* ---------------------------------------------------------------- */
  console.log("📝 Seeding profile...");
  await Profile.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        name: "Mori Aryan",
        role: "Full Stack Developer & AI Researcher",
        heroText: "Full Stack Developer & AI Researcher",
        bio: "I build production-ready web apps and applied ML systems. Currently a Machine Learning Research Intern working on transformer-based hyperspectral image super-resolution. I focus on reliable engineering and turning research into working products.",
        currentFocus: "",
        learning: "",
        internshipGoal: "",
        email: "moriaryan2024@gmail.com",
        phone: "+91-7069233316",
        avatarUrl: "",
        resumeUrl: "https://drive.google.com/uc?export=download&id=1f-dVcWAM7ZMcS5K5roiiRNoJ8TmiODKM",
        seo: {
          title: "Mori Aryan — Portfolio",
          description: "Full Stack Developer & AI Researcher. Building production-ready web apps and applied ML systems.",
          ogImage: "",
        },
        socialLinks: [
          { platform: "GitHub", url: "https://github.com/MoriAryan", displayText: "MoriAryan", icon: "github", visible: true },
          { platform: "LinkedIn", url: "https://linkedin.com/in/moriaryan", displayText: "moriaryan", icon: "linkedin", visible: true },
          { platform: "LeetCode", url: "https://leetcode.com/moriaryan", displayText: "400+ solved", icon: "code", visible: true },
          { platform: "Codeforces", url: "https://codeforces.com/profile/moriaryan", displayText: "", icon: "code", visible: true },
          { platform: "Email", url: "mailto:moriaryan2024@gmail.com", displayText: "moriaryan2024@gmail.com", icon: "mail", visible: true },
        ],
        traveller: { enabled: false },
      },
    },
    { upsert: true, new: true }
  );
  console.log("  ✅ Profile seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Education                                                        */
  /* ---------------------------------------------------------------- */
  console.log("🎓 Seeding education...");
  const educationData = [
    { institution: "SVNIT Surat", degree: "B.Tech CSE", period: "2024 – 2028", description: "", cgpa: "", order: 0 },
    { institution: "Dholakiya School, Rajkot", degree: "HSC", period: "2022 – 2024", description: "", cgpa: "", order: 1 },
  ];
  for (const edu of educationData) {
    await Education.findOneAndUpdate(
      { institution: edu.institution, degree: edu.degree },
      { $setOnInsert: edu },
      { upsert: true }
    );
  }
  console.log("  ✅ Education seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Experience                                                       */
  /* ---------------------------------------------------------------- */
  console.log("💼 Seeding experience...");
  await Experience.findOneAndUpdate(
    { title: "Machine Learning Research Intern" },
    {
      $setOnInsert: {
        title: "Machine Learning Research Intern",
        organization: "SVNIT CSE Dept",
        sponsor: "ISRO-sponsored project",
        supervisor: "under faculty supervision",
        period: "Dec 2025 – Present",
        description: [
          "Working on Super-Resolution and Fusion of Hyperspectral and Multispectral Images.",
          "Implemented transformer-based hyperspectral super-resolution models in PyTorch.",
          "Reproduced and benchmarked EDSR and RCAN, training both for 300+ epochs on a custom dataset, comparing reconstruction quality with quantitative metrics and visual analysis.",
          "Currently extending the pipeline with frequency-guided attention inspired by FreqNet, with frequency-domain (FFT) analysis.",
        ],
        isResearch: true,
        researchTopic: "Super-resolution and fusion of hyperspectral and multispectral images",
        metrics: { psnr: "", ssim: "", datasetSize: "", bands: "" },
        order: 0,
        published: true,
      },
    },
    { upsert: true }
  );
  console.log("  ✅ Experience seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Projects                                                         */
  /* ---------------------------------------------------------------- */
  console.log("🚀 Seeding projects...");
  const projectsData = [
    {
      slug: "rabuste-coffee",
      title: "Rabuste Coffee",
      cover: "/image.png",
      gallery: [],
      hook: "A live full-stack platform for a real cafe — ordering, payments, loyalty, and more.",
      problem: "",
      tech: ["Next.js", "TypeScript", "Supabase", "Prisma", "Razorpay", "Tailwind"],
      year: "2025",
      status: "Live",
      links: [{ label: "Live Demo", url: "https://rabustecoffee.vercel.app" }],
      chapters: { howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" },
      isFeatured: true,
      isVault: false,
      order: 0,
    },
    {
      slug: "orbitos",
      title: "OrbitOS",
      cover: "",
      gallery: [],
      hook: "An interactive 3D OS explorer — your task manager becomes a solar system.",
      problem: "",
      tech: ["Python", "WebSockets", "Next.js", "Three.js", "React Three Fiber", "Scapy"],
      year: "2025",
      status: "Completed",
      links: [],
      chapters: { howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" },
      isFeatured: true,
      isVault: false,
      order: 1,
    },
    {
      slug: "vendorbridge",
      title: "VendorBridge",
      cover: "",
      gallery: [],
      hook: "Procurement and vendor-management ERP built at the Odoo x KSV Hackathon.",
      problem: "",
      tech: ["React", "Node", "Express", "MongoDB", "JWT"],
      year: "2025",
      status: "Completed",
      links: [],
      chapters: { howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" },
      isFeatured: true,
      isVault: false,
      order: 2,
    },
    {
      slug: "sih-2026",
      title: "SIH 2026 (PS 26032)",
      cover: "",
      gallery: [],
      hook: "Farmer procurement slot-booking and queue-management platform. Won the internal round.",
      problem: "",
      tech: [],
      year: "2026",
      status: "Completed",
      links: [],
      chapters: { howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" },
      isFeatured: true,
      isVault: false,
      order: 3,
    },
    {
      slug: "nextevent-now",
      title: "NextEvent Now",
      cover: "/image copy 2.png",
      gallery: [],
      hook: "Campus event discovery — never miss a fest, talk, or hackathon again.",
      problem: "",
      tech: ["React.js", "Node.js", "MongoDB"],
      year: "2024",
      status: "Live",
      links: [{ label: "Live Demo", url: "https://nexteventnow.netlify.app" }],
      chapters: { howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" },
      isFeatured: false,
      isVault: true,
      order: 4,
    },
    {
      slug: "sehat-mitra",
      title: "Sehat Mitra AI Assistant",
      cover: "/image copy.png",
      gallery: [],
      hook: "Healthcare assistant that turns symptoms into preliminary prescriptions using NLP.",
      problem: "",
      tech: ["React.js", "Python (Flask)", "NLP"],
      year: "2025",
      status: "Completed",
      links: [{ label: "GitHub", url: "https://github.com/akashprofile/makernova-project" }],
      chapters: { howIBuiltIt: "", theHardParts: "", result: "", whatIdChange: "" },
      isFeatured: false,
      isVault: true,
      order: 5,
    },
  ];

  for (const proj of projectsData) {
    await Project.findOneAndUpdate(
      { slug: proj.slug },
      { $setOnInsert: { ...proj, published: true } },
      { upsert: true }
    );
  }
  console.log("  ✅ Projects seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Skills                                                           */
  /* ---------------------------------------------------------------- */
  console.log("🛠️  Seeding skills...");
  const skillsData = [
    {
      category: "Languages",
      icon: "code",
      items: [
        { name: "C++", isTopSkill: true, projectSlugs: [] },
        { name: "Python", isTopSkill: true, projectSlugs: ["orbitos", "sehat-mitra"] },
        { name: "JavaScript", isTopSkill: false, projectSlugs: ["nextevent-now", "vendorbridge"] },
        { name: "TypeScript", isTopSkill: true, projectSlugs: ["rabuste-coffee"] },
      ],
      order: 0,
    },
    {
      category: "Frontend",
      icon: "globe",
      items: [
        { name: "React", isTopSkill: true, projectSlugs: ["vendorbridge", "nextevent-now", "sehat-mitra"] },
        { name: "Next.js", isTopSkill: true, projectSlugs: ["rabuste-coffee", "orbitos"] },
        { name: "HTML", isTopSkill: false, projectSlugs: [] },
        { name: "CSS", isTopSkill: false, projectSlugs: [] },
        { name: "Tailwind", isTopSkill: false, projectSlugs: ["rabuste-coffee"] },
      ],
      order: 1,
    },
    {
      category: "Backend & DB",
      icon: "database",
      items: [
        { name: "Node.js", isTopSkill: true, projectSlugs: ["nextevent-now", "vendorbridge"] },
        { name: "Express", isTopSkill: false, projectSlugs: ["vendorbridge"] },
        { name: "REST APIs", isTopSkill: false, projectSlugs: [] },
        { name: "WebSockets", isTopSkill: false, projectSlugs: ["orbitos"] },
        { name: "PostgreSQL", isTopSkill: false, projectSlugs: ["rabuste-coffee"] },
        { name: "MongoDB", isTopSkill: false, projectSlugs: ["nextevent-now", "vendorbridge"] },
        { name: "Supabase", isTopSkill: false, projectSlugs: ["rabuste-coffee"] },
        { name: "Prisma", isTopSkill: false, projectSlugs: ["rabuste-coffee"] },
        { name: "Mongoose", isTopSkill: false, projectSlugs: ["nextevent-now"] },
      ],
      order: 2,
    },
    {
      category: "AI / ML",
      icon: "cpu",
      items: [
        { name: "PyTorch", isTopSkill: true, projectSlugs: [] },
        { name: "scikit-learn", isTopSkill: false, projectSlugs: [] },
        { name: "Pandas", isTopSkill: false, projectSlugs: [] },
        { name: "NumPy", isTopSkill: false, projectSlugs: [] },
        { name: "OpenCV", isTopSkill: false, projectSlugs: [] },
      ],
      order: 3,
    },
    {
      category: "Tools & Infra",
      icon: "wrench",
      items: [
        { name: "Git", isTopSkill: false, projectSlugs: [] },
        { name: "GitHub", isTopSkill: false, projectSlugs: [] },
        { name: "Linux", isTopSkill: false, projectSlugs: [] },
        { name: "Jupyter", isTopSkill: false, projectSlugs: [] },
      ],
      order: 4,
    },
    {
      category: "CS Fundamentals",
      icon: "book",
      items: [
        { name: "DSA", isTopSkill: true, projectSlugs: [] },
        { name: "OOP", isTopSkill: false, projectSlugs: [] },
        { name: "DBMS", isTopSkill: false, projectSlugs: [] },
        { name: "OS", isTopSkill: false, projectSlugs: [] },
        { name: "Networks", isTopSkill: false, projectSlugs: [] },
      ],
      order: 5,
    },
  ];

  for (const skill of skillsData) {
    await Skill.findOneAndUpdate(
      { category: skill.category },
      { $setOnInsert: { ...skill, published: true } },
      { upsert: true }
    );
  }
  console.log("  ✅ Skills seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Achievements                                                     */
  /* ---------------------------------------------------------------- */
  console.log("🏆 Seeding achievements...");
  const achievementsData = [
    { title: "Smart India Hackathon 2026", result: "Winner — Internal Round", year: "2026", timelineDate: "2026-01", order: 0 },
    { title: "Arbitrum Builder Pods 2026", result: "Top 5 team — State-level", year: "2026", timelineDate: "2026-01", order: 1 },
    { title: "Odoo x Indus University Hackathon 2026", result: "Finalist", year: "2026", timelineDate: "2026-01", order: 2 },
    { title: "Smart India Hackathon (SIH) 2025", result: "Internal Round Participant", year: "2025", timelineDate: "2025-09", order: 3 },
    { title: "IBM Hackathon 2025", result: "Participant", year: "2025", timelineDate: "2025-06", order: 4 },
    { title: "ACM Summer Challenge 2025", result: "Finalist", year: "2025", timelineDate: "2025-06", order: 5 },
  ];

  for (const ach of achievementsData) {
    await Achievement.findOneAndUpdate(
      { title: ach.title },
      { $setOnInsert: { ...ach, published: true } },
      { upsert: true }
    );
  }
  console.log("  ✅ Achievements seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Positions                                                        */
  /* ---------------------------------------------------------------- */
  console.log("👔 Seeding positions...");
  const positionsData = [
    { title: "Executive", organization: "ACM SVNIT Surat", description: "", since: "2025", order: 0 },
    { title: "Co-Head", organization: "MindBend, SVNIT Surat", description: "Gujarat's largest techno-managerial fest", since: "2025", order: 1 },
  ];

  for (const pos of positionsData) {
    await Position.findOneAndUpdate(
      { title: pos.title, organization: pos.organization },
      { $setOnInsert: { ...pos, published: true } },
      { upsert: true }
    );
  }
  console.log("  ✅ Positions seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Timeline                                                         */
  /* ---------------------------------------------------------------- */
  console.log("📅 Seeding timeline...");
  const timelineData = [
    { title: "Started B.Tech CSE at SVNIT Surat", description: "", date: "2024-08", category: "education" as const, order: 0 },
    { title: "Completed HSC at Dholakiya School, Rajkot", description: "", date: "2024-05", category: "education" as const, order: 1 },
    { title: "Joined ACM SVNIT as Executive", description: "", date: "2025-01", category: "position" as const, order: 2 },
    { title: "Co-Head of MindBend", description: "Gujarat's largest techno-managerial fest", date: "2025-01", category: "position" as const, order: 3 },
    { title: "ACM Summer Challenge 2025 — Finalist", description: "", date: "2025-06", category: "hackathon" as const, order: 4 },
    { title: "IBM Hackathon 2025", description: "Participant", date: "2025-06", category: "hackathon" as const, order: 5 },
    { title: "SIH 2025 Internal Round", description: "Participant", date: "2025-09", category: "hackathon" as const, order: 6 },
    { title: "Started ISRO-Sponsored ML Research at SVNIT", description: "Hyperspectral image super-resolution", date: "2025-12", category: "research" as const, order: 7 },
    { title: "SIH 2026 — Won Internal Round", description: "Farmer procurement slot-booking platform", date: "2026-01", category: "hackathon" as const, order: 8 },
    { title: "Arbitrum Builder Pods 2026 — Top 5 State", description: "", date: "2026-01", category: "hackathon" as const, order: 9 },
    { title: "Odoo x Indus Hackathon 2026 — Finalist", description: "", date: "2026-01", category: "hackathon" as const, order: 10 },
  ];

  for (const entry of timelineData) {
    await Timeline.findOneAndUpdate(
      { title: entry.title },
      { $setOnInsert: { ...entry, published: true } },
      { upsert: true }
    );
  }
  console.log("  ✅ Timeline seeded\n");

  /* ---------------------------------------------------------------- */
  /*  Sections                                                         */
  /* ---------------------------------------------------------------- */
  console.log("📐 Seeding sections...");
  const sectionsData = [
    { key: "trailhead", displayName: "Trailhead", navLabel: "Home", order: 0 },
    { key: "road", displayName: "The Road So Far", navLabel: "Journey", order: 1 },
    { key: "workshop", displayName: "The Workshop", navLabel: "Projects", order: 2 },
    { key: "research", displayName: "The Research Outpost", navLabel: "Research", order: 3 },
    { key: "capabilities", displayName: "Capabilities", navLabel: "Skills", order: 4 },
    { key: "vault", displayName: "The Vault", navLabel: "Vault", order: 5 },
    { key: "crossroads", displayName: "The Crossroads", navLabel: "Contact", order: 6 },
  ];

  for (const sec of sectionsData) {
    await Section.findOneAndUpdate(
      { key: sec.key },
      { $setOnInsert: { ...sec, visible: true } },
      { upsert: true }
    );
  }
  console.log("  ✅ Sections seeded\n");

  /* ---------------------------------------------------------------- */
  console.log("🎉 Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
