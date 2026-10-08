import { getVaultProjects } from "@/lib/data";
import ProjectVault from "./ProjectVault";
import type { VaultProject } from "./ProjectVault";

/**
 * Server Component wrapper for ProjectVault.
 * Fetches vault projects from the database and maps them
 * to the shape expected by the client component.
 */
export default async function ProjectVaultServer() {
  const dbProjects = await getVaultProjects();

  // Map DB shape → VaultProject shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects: VaultProject[] = dbProjects.map((p: any) => ({
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

  return <ProjectVault projects={projects} />;
}
