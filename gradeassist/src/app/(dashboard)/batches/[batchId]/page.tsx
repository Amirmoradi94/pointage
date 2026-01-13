"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const mockBatch = {
  id: "b1",
  assignmentId: "a1",
  assignmentTitle: "Assignment 1: Variables and Data Types",
  courseCode: "CS101",
  status: "GRADING",
  totalSubmissions: 45,
  uploadedBy: "John Doe",
  createdAt: "2024-01-10T14:30:00Z",
  progress: {
    pending: 5,
    converting: 2,
    grading: 10,
    graded: 25,
    failed: 3,
  },
};

export default function BatchDetailPage({ params }: { params: { batchId: string } }) {
  const totalProcessed = mockBatch.progress.graded + mockBatch.progress.failed;
  const progressPercent = (totalProcessed / mockBatch.totalSubmissions) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Batch #{params.batchId.slice(0, 8)}</h1>
            <Badge
              variant={
                mockBatch.status === "COMPLETED"
                  ? "default"
                  : mockBatch.status === "FAILED"
                  ? "destructive"
                  : "secondary"
              }
            >
              {mockBatch.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {mockBatch.courseCode} - {mockBatch.assignmentTitle}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{mockBatch.totalSubmissions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-2xl font-semibold">{mockBatch.progress.graded}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <p className="text-2xl font-semibold">
                {mockBatch.progress.grading + mockBatch.progress.converting + mockBatch.progress.pending}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-2xl font-semibold">{mockBatch.progress.failed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processing Progress</CardTitle>
          <CardDescription>
            {totalProcessed} of {mockBatch.totalSubmissions} submissions processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercent} className="h-2" />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Graded</span>
              </div>
              <span className="font-medium">{mockBatch.progress.graded}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-gray-600">Grading</span>
              </div>
              <span className="font-medium">{mockBatch.progress.grading}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-gray-600">Converting</span>
              </div>
              <span className="font-medium">{mockBatch.progress.converting}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500" />
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-medium">{mockBatch.progress.pending}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-gray-600">Failed</span>
              </div>
              <span className="font-medium">{mockBatch.progress.failed}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {mockBatch.progress.failed > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-900">Failed Submissions</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              {mockBatch.progress.failed} submissions failed to process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
              View Failed Submissions
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Batch Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Uploaded by</span>
            <span className="font-medium">{mockBatch.uploadedBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Created at</span>
            <span className="font-medium">
              {new Date(mockBatch.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Batch ID</span>
            <span className="font-mono text-xs">{params.batchId}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
