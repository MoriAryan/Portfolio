import { createGetUpdateDelete } from "@/lib/crud-factory";
import { Position } from "@/lib/models";
import { positionSchema } from "@/lib/validations";

export const { GET, PUT, DELETE } = createGetUpdateDelete(Position, positionSchema);
