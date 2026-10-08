import { createListAndCreate } from "@/lib/crud-factory";
import { Skill } from "@/lib/models";
import { skillSchema } from "@/lib/validations";

export const { GET, POST } = createListAndCreate(Skill, skillSchema);
