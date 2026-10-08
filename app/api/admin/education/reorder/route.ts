import { createReorder } from "@/lib/crud-factory";
import { Education } from "@/lib/models";

export const { POST } = createReorder(Education);
