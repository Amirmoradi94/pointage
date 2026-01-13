"use client";

import Link from "next/link";
import { ArrowLeft, Plus, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockCourse = {
  id: "1",
  name: "Introduction to Computer Science",
  code: "CS101",
  semester: "Fall",
  year: 2024,
  description: "An introductory course covering fundamental concepts in computer science.",
  courseType: "COMPUTER_SCIENCE",
};

const mockAssignments = [
  { id: "a1", title: "Assignment 1: Variables and Data Types", dueDate: "2024-09-15", status: "COMPLETED", submissionCount: 45 },
  { id: "a2", title: "Assignment 2: Control Structures", dueDate: "2024-09-22", status: "GRADING", submissionCount: 42 },
  { id: "a3", title: "Assignment 3: Functions and Modules", dueDate: "2024-09-29", status: "ACTIVE", submissionCount: 0 },
];

export default function CoursePage({ params }: { params: { courseId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{mockCourse.code}</h1>
            <Badge variant="outline">
              {mockCourse.semester} {mockCourse.year}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-600">{mockCourse.name}</p>
        </div>
        <Link href={`/courses/${params.courseId}/assignments/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </Link>
      </div>

      {mockCourse.description && (
        <Card>
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{mockCourse.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Manage assignments and view grading progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {assignment.dueDate} • {assignment.submissionCount} submissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      assignment.status === "COMPLETED"
                        ? "default"
                        : assignment.status === "GRADING"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {assignment.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Link href={`/courses/${params.courseId}/assignments/${assignment.id}/upload`}>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/courses/${params.courseId}/assignments/${assignment.id}/review`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {mockAssignments.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm font-medium text-gray-900">
                  No assignments yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first assignment to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
