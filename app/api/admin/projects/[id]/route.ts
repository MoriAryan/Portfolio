import { NextResponse } from "next/server";
import { adminHandler, parseBody } from "@/lib/admin-helpers";
import { Project } from "@/lib/models";
import { projectSchema } from "@/lib/validations";

// GET single project
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return adminHandler(async () => {
    const { id } = await params;
    const item = await Project.findById(id).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  });
}

// PUT — update project (enforces max 5 featured)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return adminHandler(async () => {
    const { id } = await params;
    const [data, error] = await parseBody(request, projectSchema);
    if (error) return error;

    // Enforce featured cap: only check if toggling ON
    if (data.isFeatured) {
      const current = await Project.findById(id).lean();
      if (current && !current.isFeatured) {
        const featuredCount = await Project.countDocuments({ isFeatured: true });
        if (featuredCount >= 5) {
          return NextResponse.json(
            { error: "Maximum 5 featured projects allowed. Unfeature one first." },
            { status: 400 }
          );
        }
      }
    }

    const item = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  });
}

// DELETE
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return adminHandler(async () => {
    const { id } = await params;
    const item = await Project.findByIdAndDelete(id).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  });
}
