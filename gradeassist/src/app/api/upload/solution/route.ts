import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/storage/supabase";

const MAX_SOLUTION_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const filename: string | undefined = body?.filename;
  const contentType: string | undefined = body?.contentType;
  const size: number | undefined = body?.size;
  const assignmentId: string | undefined = body?.assignmentId;

  if (!filename || !contentType || typeof size !== "number") {
    return NextResponse.json(
      { message: "Missing filename, contentType, or size" },
      { status: 400 },
    );
  }

  if (size > MAX_SOLUTION_SIZE) {
    return NextResponse.json({ message: "File too large (max 50MB)" }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  
  // Create a unique path for the solution file
  const fileExt = filename.split('.').pop() || 'bin';
  const uniqueId = randomUUID();
  const path = assignmentId 
    ? `${assignmentId}/${uniqueId}.${fileExt}`
    : `${uniqueId}-${filename}`;

  const { data, error } = await supabase.storage
    .from("solutions")
    .createSignedUploadUrl(path);

  if (error || !data?.signedUrl) {
    console.error("Failed to create signed upload URL:", error);
    return NextResponse.json(
      { message: "Failed to create signed upload URL" },
      { status: 500 },
    );
  }

  // Get the public URL for the file
  const { data: urlData } = supabase.storage
    .from("solutions")
    .getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    path,
    publicUrl: urlData.publicUrl,
  });
}
