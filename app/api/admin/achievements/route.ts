import { createListAndCreate } from "@/lib/crud-factory";
import { Achievement } from "@/lib/models";
import { achievementSchema } from "@/lib/validations";

export const { GET, POST } = createListAndCreate(Achievement, achievementSchema);
