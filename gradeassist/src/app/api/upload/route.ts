import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { createServiceSupabaseClient } from "@/lib/storage/supabase";
import { STORAGE_BUCKETS } from "@/lib/storage/upload";

const allowedBuckets = new Set(STORAGE_BUCKETS);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const filename: string | undefined = body?.filename;
  const contentType: string | undefined = body?.contentType;
  const size: number | undefined = body?.size;
  const bucket: string | undefined = body?.bucket;

  if (!filename || !contentType || typeof size !== "number" || !bucket) {
    return NextResponse.json(
      { message: "Missing filename, contentType, size, or bucket" },
      { status: 400 },
    );
  }

  if (!STORAGE_BUCKETS.includes(bucket as any)) {
    return NextResponse.json({ message: "Invalid bucket" }, { status: 400 });
  }

  if (!Object.keys(ACCEPTED_FILE_TYPES).includes(contentType)) {
    return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
  }

  if (size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "File too large" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  const path = `${randomUUID()}-${filename}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { message: "Failed to create signed upload URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    path,
  });
}
