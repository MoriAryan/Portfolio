import { NextResponse } from "next/server";
import { adminHandler, parseBody } from "@/lib/admin-helpers";
import { Project } from "@/lib/models";
import { projectSchema } from "@/lib/validations";

// GET — list all projects
export async function GET() {
  return adminHandler(async () => {
    const items = await Project.find().sort({ order: 1 }).lean();
    return NextResponse.json(items);
  });
}

// POST — create project (enforces max 5 featured)
export async function POST(request: Request) {
  return adminHandler(async () => {
    const [data, error] = await parseBody(request, projectSchema);
    if (error) return error;

    // Enforce featured cap
    if (data.isFeatured) {
      const featuredCount = await Project.countDocuments({ isFeatured: true });
      if (featuredCount >= 5) {
        return NextResponse.json(
          { error: "Maximum 5 featured projects allowed. Unfeature one first." },
          { status: 400 }
        );
      }
    }

    const item = await Project.create(data);
    return NextResponse.json(item.toObject(), { status: 201 });
  });
}
