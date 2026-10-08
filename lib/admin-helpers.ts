import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ZodSchema } from "zod";

/**
 * Verify the admin session server-side on every API call.
 * Returns null if authorized, or a 401 response if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Parse and validate request body with a Zod schema.
 * Returns [data, null] on success or [null, errorResponse] on failure.
 */
export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<[T, null] | [null, NextResponse]> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return [null, NextResponse.json({ error: "Invalid JSON" }, { status: 400 })];
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return [
      null,
      NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      ),
    ];
  }

  return [result.data, null];
}

/**
 * Standard wrapper for admin API handlers.
 * Connects to DB, verifies session, and revalidates the public site on mutation.
 */
export async function adminHandler(
  handler: () => Promise<NextResponse>,
  revalidate: string | string[] = "/"
): Promise<NextResponse> {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await connectDB();

  const response = await handler();

  // Revalidate public site after successful mutations
  if (response.status >= 200 && response.status < 300) {
    const paths = Array.isArray(revalidate) ? revalidate : [revalidate];
    for (const path of paths) {
      revalidatePath(path);
    }
  }

  return response;
}
