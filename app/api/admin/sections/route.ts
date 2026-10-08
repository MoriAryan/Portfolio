import { createListAndCreate } from "@/lib/crud-factory";
import { Section } from "@/lib/models";
import { sectionSchema } from "@/lib/validations";

export const { GET, POST } = createListAndCreate(Section, sectionSchema);
