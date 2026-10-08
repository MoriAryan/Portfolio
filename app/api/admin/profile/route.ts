import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminHandler, parseBody } from "@/lib/admin-helpers";
import { Profile } from "@/lib/models";
import { profileSchema } from "@/lib/validations";

// GET /api/admin/profile — fetch the singleton profile
export async function GET() {
  return adminHandler(async () => {
    const profile = await Profile.findOne().lean();
    return NextResponse.json(profile || {});
  });
}

// PUT /api/admin/profile — update (or create) the singleton profile
export async function PUT(request: Request) {
  return adminHandler(async () => {
    const [data, error] = await parseBody(request, profileSchema);
    if (error) return error;

    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: data },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    try {
      revalidatePath("/");
    } catch {
      // Ignore during test contexts
    }

    return NextResponse.json(profile);
  });
}
