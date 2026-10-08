import { createListAndCreate } from "@/lib/crud-factory";
import { Experience } from "@/lib/models";
import { experienceSchema } from "@/lib/validations";

export const { GET, POST } = createListAndCreate(Experience, experienceSchema);
