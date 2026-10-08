import { createGetUpdateDelete } from "@/lib/crud-factory";
import { Experience } from "@/lib/models";
import { experienceSchema } from "@/lib/validations";

export const { GET, PUT, DELETE } = createGetUpdateDelete(Experience, experienceSchema);
