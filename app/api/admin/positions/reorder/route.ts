import { createReorder } from "@/lib/crud-factory";
import { Position } from "@/lib/models";

export const { POST } = createReorder(Position);
