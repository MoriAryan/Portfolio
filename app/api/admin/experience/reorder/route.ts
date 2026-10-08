import { createReorder } from "@/lib/crud-factory";
import { Experience } from "@/lib/models";

export const { POST } = createReorder(Experience);
