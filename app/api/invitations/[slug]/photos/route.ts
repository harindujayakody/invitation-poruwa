import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invitations, media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadPhotoFile } from "@/lib/storage";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Verify invitation exists
    const [inv] = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(eq(invitations.slug, slug))
      .limit(1);

    if (!inv) {
      return NextResponse.json({ error: "invitation_not_found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 },
      );
    }

    const uploadResult = await uploadPhotoFile(file, inv.id);
    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json(
        { error: uploadResult.error || "Failed to upload photo" },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(media)
      .values({
        invitationId: inv.id,
        kind: "guest",
        storageKey: uploadResult.url,
        moderation: "pending",
      })
      .returning();

    return NextResponse.json({
      success: true,
      mediaId: inserted.id,
      url: uploadResult.url,
      moderation: inserted.moderation,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
