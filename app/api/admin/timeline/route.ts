import { createListAndCreate } from "@/lib/crud-factory";
import { Timeline } from "@/lib/models";
import { timelineSchema } from "@/lib/validations";

export const { GET, POST } = createListAndCreate(Timeline, timelineSchema);
