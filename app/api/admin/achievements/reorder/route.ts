import { createReorder } from "@/lib/crud-factory";
import { Achievement } from "@/lib/models";

export const { POST } = createReorder(Achievement);
