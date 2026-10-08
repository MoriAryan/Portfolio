import { createGetUpdateDelete } from "@/lib/crud-factory";
import { Section } from "@/lib/models";
import { sectionSchema } from "@/lib/validations";

export const { GET, PUT, DELETE } = createGetUpdateDelete(Section, sectionSchema);
