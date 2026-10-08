/**
 * Static fallback data — used when the DB is empty or unreachable.
 * This ensures the public site is never blank.
 */

export const FALLBACK_PROFILE = {
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
    description: "Full Stack Developer & AI Researcher.",
    ogImage: "",
  },
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/MoriAryan", displayText: "MoriAryan", icon: "github", visible: true },
    { platform: "LinkedIn", url: "https://linkedin.com/in/moriaryan", displayText: "moriaryan", icon: "linkedin", visible: true },
    { platform: "Email", url: "mailto:moriaryan2024@gmail.com", displayText: "moriaryan2024@gmail.com", icon: "mail", visible: true },
  ],
  traveller: { enabled: false },
};

export const FALLBACK_EXPERIENCES = [
  {
    _id: "fallback-exp-1",
    title: "Machine Learning Research Intern",
    organization: "SVNIT CSE Dept",
    sponsor: "ISRO-sponsored project",
    supervisor: "under faculty supervision",
    period: "Dec 2025 – Present",
    description: [
      "Working on Super-Resolution and Fusion of Hyperspectral and Multispectral Images.",
      "Implemented transformer-based hyperspectral super-resolution models in PyTorch.",
      "Reproduced and benchmarked EDSR and RCAN, training both for 300+ epochs on a custom dataset.",
    ],
    isResearch: true,
    published: true,
    order: 0,
  },
];

export const FALLBACK_PROJECTS = [
  {
    _id: "fallback-proj-1",
    slug: "rabuste-coffee",
    title: "Rabuste Coffee",
    cover: "/image.png",
    hook: "A live full-stack platform for a real cafe.",
    tech: ["Next.js", "TypeScript", "Supabase", "Prisma", "Razorpay", "Tailwind"],
    year: "2025",
    status: "Live",
    links: [{ label: "Live Demo", url: "https://rabustecoffee.vercel.app" }],
    isFeatured: true,
    isVault: false,
    published: true,
    order: 0,
  },
  {
    _id: "fallback-proj-2",
    slug: "nextevent-now",
    title: "NextEvent Now",
    cover: "/image copy 2.png",
    hook: "Campus event discovery — never miss a fest, talk, or hackathon again.",
    tech: ["React.js", "Node.js", "MongoDB"],
    year: "2024",
    status: "Live",
    links: [{ label: "Live Demo", url: "https://nexteventnow.netlify.app" }],
    isFeatured: false,
    isVault: true,
    published: true,
    order: 4,
  },
  {
    _id: "fallback-proj-3",
    slug: "sehat-mitra",
    title: "Sehat Mitra AI Assistant",
    cover: "/image copy.png",
    hook: "Healthcare assistant that turns symptoms into preliminary prescriptions using NLP.",
    tech: ["React.js", "Python (Flask)", "NLP"],
    year: "2025",
    status: "Completed",
    links: [{ label: "GitHub", url: "https://github.com/akashprofile/makernova-project" }],
    isFeatured: false,
    isVault: true,
    published: true,
    order: 5,
  },
];

export const FALLBACK_SKILLS = [
  {
    _id: "fallback-skill-1",
    category: "Languages",
    items: [
      { name: "C++", isTopSkill: true, projectSlugs: [] },
      { name: "Python", isTopSkill: true, projectSlugs: [] },
      { name: "JavaScript", isTopSkill: false, projectSlugs: [] },
      { name: "TypeScript", isTopSkill: true, projectSlugs: [] },
    ],
    icon: "code",
    order: 0,
    published: true,
  },
  {
    _id: "fallback-skill-2",
    category: "Frontend",
    items: [
      { name: "React", isTopSkill: true, projectSlugs: [] },
      { name: "Next.js", isTopSkill: true, projectSlugs: [] },
      { name: "Tailwind", isTopSkill: false, projectSlugs: [] },
    ],
    icon: "globe",
    order: 1,
    published: true,
  },
  {
    _id: "fallback-skill-3",
    category: "Backend & DB",
    items: [
      { name: "Node.js", isTopSkill: true, projectSlugs: [] },
      { name: "MongoDB", isTopSkill: false, projectSlugs: [] },
      { name: "PostgreSQL", isTopSkill: false, projectSlugs: [] },
    ],
    icon: "database",
    order: 2,
    published: true,
  },
  {
    _id: "fallback-skill-4",
    category: "AI / ML",
    items: [
      { name: "PyTorch", isTopSkill: true, projectSlugs: [] },
      { name: "scikit-learn", isTopSkill: false, projectSlugs: [] },
      { name: "OpenCV", isTopSkill: false, projectSlugs: [] },
    ],
    icon: "cpu",
    order: 3,
    published: true,
  },
];

export const FALLBACK_ACHIEVEMENTS = [
  { _id: "fallback-ach-1", title: "Smart India Hackathon 2026", result: "Winner — Internal Round", year: "2026", published: true, order: 0 },
  { _id: "fallback-ach-2", title: "Arbitrum Builder Pods 2026", result: "Top 5 team — State-level", year: "2026", published: true, order: 1 },
  { _id: "fallback-ach-3", title: "ACM Summer Challenge 2025", result: "Finalist", year: "2025", published: true, order: 2 },
];

export const FALLBACK_SECTIONS = [
  { key: "trailhead", displayName: "Trailhead", navLabel: "Home", order: 0, visible: true },
  { key: "road", displayName: "The Road So Far", navLabel: "Journey", order: 1, visible: true },
  { key: "workshop", displayName: "The Workshop", navLabel: "Projects", order: 2, visible: true },
  { key: "research", displayName: "The Research Outpost", navLabel: "Research", order: 3, visible: true },
  { key: "capabilities", displayName: "Capabilities", navLabel: "Skills", order: 4, visible: true },
  { key: "vault", displayName: "The Vault", navLabel: "Vault", order: 5, visible: true },
  { key: "crossroads", displayName: "The Crossroads", navLabel: "Contact", order: 6, visible: true },
];
