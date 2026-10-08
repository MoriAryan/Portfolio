import { createGetUpdateDelete } from "@/lib/crud-factory";
import { Achievement } from "@/lib/models";
import { achievementSchema } from "@/lib/validations";

export const { GET, PUT, DELETE } = createGetUpdateDelete(Achievement, achievementSchema);
