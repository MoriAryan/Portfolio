import { createGetUpdateDelete } from "@/lib/crud-factory";
import { Education } from "@/lib/models";
import { educationSchema } from "@/lib/validations";

export const { GET, PUT, DELETE } = createGetUpdateDelete(Education, educationSchema);
