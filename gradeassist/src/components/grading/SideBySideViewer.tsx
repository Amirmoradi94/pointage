"use client";

import Image from "next/image";

export interface SideBySideViewerProps {
  submissionImage?: string;
  solutionImage?: string;
}

export function SideBySideViewer({
  submissionImage,
  solutionImage,
}: SideBySideViewerProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
        <p className="mb-2 text-sm font-medium text-gray-900">Submission</p>
        {submissionImage ? (
          <Image
            src={submissionImage}
            alt="Submission page"
            width={1200}
            height={1600}
            className="h-[420px] w-full rounded-md object-contain"
          />
        ) : (
          <Placeholder />
        )}
      </div>
      <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
        <p className="mb-2 text-sm font-medium text-gray-900">Solution</p>
        {solutionImage ? (
          <Image
            src={solutionImage}
            alt="Solution page"
            width={1200}
            height={1600}
            className="h-[420px] w-full rounded-md object-contain"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}

const Placeholder = () => (
  <div className="flex h-[420px] items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
    No image available
  </div>
);
