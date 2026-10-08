import { createReorder } from "@/lib/crud-factory";
import { Section } from "@/lib/models";

export const { POST } = createReorder(Section);
