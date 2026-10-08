import { createReorder } from "@/lib/crud-factory";
import { Skill } from "@/lib/models";

export const { POST } = createReorder(Skill);
