import { createGetUpdateDelete } from "@/lib/crud-factory";
import { Skill } from "@/lib/models";
import { skillSchema } from "@/lib/validations";

export const { GET, PUT, DELETE } = createGetUpdateDelete(Skill, skillSchema);
