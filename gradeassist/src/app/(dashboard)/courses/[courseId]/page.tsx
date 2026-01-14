"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  FileText,
  Upload,
  BarChart3,
  Trash2,
  Eye,
} from "lucide-react";
import { api } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AssignmentStatus } from "@prisma/client";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  // Fetch course details
  const { data: course, isLoading: courseLoading } = api.course.byId.useQuery({
    id: courseId,
  });

  // Fetch assignments for this course
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    refetch,
  } = api.assignment.listByCourse.useQuery({ courseId }) as {
    data: Array<{
      id: string;
      title: string;
      status: AssignmentStatus;
      dueDate?: Date | string | null;
      _count: {
        submissions: number;
        batches: number;
      };
    }> | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  const deleteMutation = api.assignment.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (courseLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Course not found</div>
      </div>
    );
  }

  const getStatusBadge = (status: AssignmentStatus) => {
    const variants: Record<
      AssignmentStatus,
      { label: string; className: string }
    > = {
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
      GRADING: { label: "Grading", className: "bg-blue-100 text-blue-800" },
      REVIEW: { label: "In Review", className: "bg-orange-100 text-orange-800" },
      COMPLETED: {
        label: "Completed",
        className: "bg-purple-100 text-purple-800",
      },
      ARCHIVED: { label: "Archived", className: "bg-gray-100 text-gray-600" },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.className} variant="secondary">
        {variant.label}
      </Badge>
    );
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">
              {course.code}
            </h1>
            <Badge variant="outline">
              {course.semester} {course.year}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-600">{course.name}</p>
        </div>
        <Link href={`/courses/${courseId}/assignments/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </Link>
      </div>

      {course.description && (
        <Card>
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{course.description}</p>
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
            {assignments && assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/courses/${courseId}/assignments/${assignment.id}`}
                      >
                        <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition">
                          {assignment.title}
                        </p>
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        {assignment.dueDate && (
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(assignment.dueDate)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {assignment._count.submissions} submission
                          {assignment._count.submissions !== 1 ? "s" : ""}
                        </p>
                        {assignment._count.batches > 0 && (
                          <p className="text-xs text-gray-500">
                            {assignment._count.batches} batch
                            {assignment._count.batches !== 1 ? "es" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(assignment.status)}
                    <div className="flex gap-2">
                      <Link
                        href={`/courses/${courseId}/assignments/${assignment.id}`}
                      >
                        <Button size="sm" variant="outline" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        href={`/courses/${courseId}/assignments/${assignment.id}/upload`}
                      >
                        <Button size="sm" variant="outline" title="Upload Submissions">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Delete Assignment"
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete "${assignment.title}"? This will delete all submissions and grades.`
                            )
                          ) {
                            deleteMutation.mutate({ id: assignment.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm font-medium text-gray-900">
                  No assignments yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first assignment to get started
                </p>
                <Link href={`/courses/${courseId}/assignments/new`}>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
