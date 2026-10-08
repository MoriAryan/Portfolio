import {
  getProfile,
  getExperiences,
  getFeaturedProjects,
  getVaultProjects,
  getSkills,
  getAchievements,
  getPositions,
  getTimeline,
  getSections,
  getResearchExperience,
  getEducation,
} from "@/lib/data";
import Portfolio from "./components/PortfolioClient";
import type { VaultProject } from "./components/ProjectVault";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const [
    profile,
    experiences,
    featuredProjects,
    vaultDbProjects,
    skills,
    achievements,
    positions,
    timeline,
    sections,
    research,
    education,
  ] = await Promise.all([
    getProfile(),
    getExperiences(),
    getFeaturedProjects(),
    getVaultProjects(),
    getSkills(),
    getAchievements(),
    getPositions(),
    getTimeline(),
    getSections(),
    getResearchExperience(),
    getEducation(),
  ]);

  // Map vault projects to the shape expected by ProjectVault
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaultProjects: VaultProject[] = vaultDbProjects.map((p: any) => ({
    id: p._id?.toString() || p.slug,
    slug: p.slug,
    title: p.title,
    hook: p.hook || "",
    tech: p.tech || [],
    year: p.year || "",
    status: p.status || "",
    link: p.links?.[0]?.url || "",
    image: p.cover || "",
  }));

  return (
    <Portfolio
      profile={profile}
      experiences={experiences}
      featuredProjects={featuredProjects}
      vaultProjects={vaultProjects}
      skills={skills}
      achievements={achievements}
      positions={positions}
      timeline={timeline}
      sections={sections}
      research={research}
      education={education}
    />
  );
}
