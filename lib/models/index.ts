/**
 * Barrel export — import all models from one place.
 * Importing this file also ensures all models are registered
 * with Mongoose before any query runs.
 */
export { Profile } from "./profile";
export type { IProfile } from "./profile";

export { Education } from "./education";
export type { IEducation } from "./education";

export { Experience } from "./experience";
export type { IExperience } from "./experience";

export { Project } from "./project";
export type { IProject } from "./project";

export { Skill } from "./skill";
export type { ISkill } from "./skill";

export { Achievement } from "./achievement";
export type { IAchievement } from "./achievement";

export { Position } from "./position";
export type { IPosition } from "./position";

export { Timeline } from "./timeline";
export type { ITimeline } from "./timeline";

export { Section } from "./section";
export type { ISection } from "./section";
