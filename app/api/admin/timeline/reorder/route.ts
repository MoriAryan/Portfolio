import { createReorder } from "@/lib/crud-factory";
import { Timeline } from "@/lib/models";

export const { POST } = createReorder(Timeline);
