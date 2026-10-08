import { createListAndCreate } from "@/lib/crud-factory";
import { Position } from "@/lib/models";
import { positionSchema } from "@/lib/validations";

export const { GET, POST } = createListAndCreate(Position, positionSchema);
