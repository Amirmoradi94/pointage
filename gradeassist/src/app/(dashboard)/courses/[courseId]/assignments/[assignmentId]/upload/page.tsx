"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropzoneUploader } from "@/components/upload/DropzoneUploader";

export default function UploadSubmissionsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const assignmentId = params.assignmentId as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/courses/${courseId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <p className="text-sm text-gray-500">Submissions</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Upload student submissions
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Files are uploaded to Supabase storage and processed by the worker
            pipeline.
          </p>
        </div>
      </div>
      <DropzoneUploader assignmentId={assignmentId} courseId={courseId} />
    </div>
  );
}
