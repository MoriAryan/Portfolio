import { createReorder } from "@/lib/crud-factory";
import { Project } from "@/lib/models";

export const { POST } = createReorder(Project);
