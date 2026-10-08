import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Profile } from "@/lib/models";

/**
 * GET /resume — stable public URL that always redirects to the current resume.
 * Links printed on paper or shared never break.
 */
export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findOne().select("resumeUrl").lean();

    if (profile?.resumeUrl) {
      return NextResponse.redirect(profile.resumeUrl, 302);
    }
  } catch (e) {
    console.error("Resume redirect — DB error:", e);
  }

  // Fallback: local PDF if DB is empty or unreachable
  return NextResponse.redirect(new URL("/Resume.pdf", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), 302);
}
