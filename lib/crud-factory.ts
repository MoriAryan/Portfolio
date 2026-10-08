import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminHandler, parseBody } from "@/lib/admin-helpers";
import type { Model } from "mongoose";
import type { ZodSchema } from "zod";
import { reorderSchema } from "@/lib/validations";

/**
 * Creates standard GET (list) and POST (create) handlers for a collection.
 */
export function createListAndCreate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  schema: ZodSchema
) {
  async function GET() {
    return adminHandler(async () => {
      const items = await model.find().sort({ order: 1 }).lean();
      return NextResponse.json(items);
    });
  }

  async function POST(request: Request) {
    return adminHandler(async () => {
      const [data, error] = await parseBody(request, schema);
      if (error) return error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = await model.create(data as any);
      try {
        revalidatePath("/");
      } catch {
        // Ignore during test contexts
      }
      return NextResponse.json(item.toObject(), { status: 201 });
    });
  }

  return { GET, POST };
}

/**
 * Creates standard GET (single), PUT (update), and DELETE handlers for a document by ID.
 */
export function createGetUpdateDelete(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  schema: ZodSchema
) {
  async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    return adminHandler(async () => {
      const { id } = await params;
      const item = await model.findById(id).lean();
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(item);
    });
  }

  async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    return adminHandler(async () => {
      const { id } = await params;
      const [data, error] = await parseBody(request, schema);
      if (error) return error;

      const item = await model.findByIdAndUpdate(
        id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { $set: data as any },
        { new: true, runValidators: true }
      ).lean();

      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      try {
        revalidatePath("/");
      } catch {
        // Ignore during test contexts
      }
      return NextResponse.json(item);
    });
  }

  async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    return adminHandler(async () => {
      const { id } = await params;
      const item = await model.findByIdAndDelete(id).lean();
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      try {
        revalidatePath("/");
      } catch {
        // Ignore during test contexts
      }
      return NextResponse.json({ success: true });
    });
  }

  return { GET, PUT, DELETE };
}

/**
 * Creates a POST handler for reordering items via drag-and-drop.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createReorder(model: Model<any>) {
  async function POST(request: Request) {
    return adminHandler(async () => {
      const [data, error] = await parseBody(request, reorderSchema);
      if (error) return error;

      const ops = data.ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        },
      }));

      await model.bulkWrite(ops);
      try {
        revalidatePath("/");
      } catch {
        // Ignore during test contexts
      }
      return NextResponse.json({ success: true });
    });
  }

  return { POST };
}
