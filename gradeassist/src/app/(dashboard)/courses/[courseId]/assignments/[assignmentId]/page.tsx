"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  BarChart3,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Download,
  Edit,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SubmissionStatus } from "@prisma/client";
import { EditStudentInfoDialog } from "@/components/submissions/EditStudentInfoDialog";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const assignmentId = params.assignmentId as string;

  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "studentId" | "score">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingSubmission, setEditingSubmission] = useState<{
    id: string;
    studentIdentifier: string;
    extractedStudentName: string | null;
    extractedStudentId: string | null;
    originalFilename: string;
  } | null>(null);

  // Fetch assignment details
  const { data: assignment, isLoading: assignmentLoading } =
    api.assignment.byId.useQuery({ id: assignmentId });

  // Fetch statistics
  const { data: stats, isLoading: statsLoading } =
    api.assignment.statistics.useQuery({ assignmentId });

  // Fetch submissions with filters
  const { data: submissions, isLoading: submissionsLoading, refetch } =
    api.submission.listByAssignment.useQuery({
      assignmentId,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      sortBy,
      sortOrder,
    }) as {
      data: Array<{
        id: string;
        studentIdentifier: string;
        extractedStudentName: string | null;
        extractedStudentId: string | null;
        originalFilename: string;
        status: SubmissionStatus;
        createdAt: Date | string;
        grade?: {
          aiScore: number | null;
          finalScore: number | null;
          aiConfidence: number | null;
        } | null;
        batch?: {
          id: string;
          status: string;
        } | null;
      }> | undefined;
      isLoading: boolean;
      refetch: () => void;
    };

  const deleteMutation = api.submission.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleExport = async (format: "xlsx" | "csv") => {
    try {
      const response = await fetch(
        `/api/assignments/${assignmentId}/export?format=${format}`
      );
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grades.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export grades. Please try again.");
    }
  };

  if (assignmentLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading assignment...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Assignment not found</div>
      </div>
    );
  }

  const getStatusBadge = (status: SubmissionStatus) => {
    const variants: Record<SubmissionStatus, { label: string; className: string }> = {
      PENDING_UPLOAD: { label: "Pending Upload", className: "bg-gray-100 text-gray-800" },
      UPLOADING: { label: "Uploading", className: "bg-yellow-100 text-yellow-800" },
      PENDING_CONVERSION: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      CONVERTING: { label: "Converting", className: "bg-blue-100 text-blue-800" },
      PENDING_GRADING: { label: "Pending Grading", className: "bg-purple-100 text-purple-800" },
      GRADING: { label: "Grading", className: "bg-indigo-100 text-indigo-800" },
      GRADED: { label: "Graded", className: "bg-green-100 text-green-800" },
      FAILED: { label: "Failed", className: "bg-red-100 text-red-800" },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.className} variant="secondary">
        {variant.label}
      </Badge>
    );
  };

  const getScoreTrend = (score: number) => {
    if (!stats) return <Minus className="h-4 w-4 text-gray-400" />;
    if (score > stats.averageScore) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score < stats.averageScore) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Assignment</p>
          <h1 className="text-2xl font-semibold text-gray-900">{assignment.title}</h1>
          {assignment.description && (
            <p className="mt-1 text-sm text-gray-600">{assignment.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport("xlsx")}
            disabled={!submissions || submissions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            disabled={!submissions || submissions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link
            href={`/courses/${courseId}/assignments/${assignmentId}/upload`}
          >
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Submissions
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.gradedSubmissions} graded, {stats.pendingSubmissions} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Score
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageScore.toFixed(1)}
                <span className="text-sm font-normal text-gray-500">/100</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Range: {stats.minScore} - {stats.maxScore}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Graded
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.gradedSubmissions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalSubmissions > 0
                  ? Math.round((stats.gradedSubmissions / stats.totalSubmissions) * 100)
                  : 0}
                % completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                AI Confidence
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.averageConfidence * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average confidence level
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Score Distribution */}
      {stats && stats.gradedSubmissions > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>
              Breakdown of grades across different score ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.scoreDistribution).map(([range, count]) => (
                <div key={range} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium text-gray-600">{range}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${stats.gradedSubmissions > 0 ? (count / stats.gradedSubmissions) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                Manage and review student submissions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as SubmissionStatus | "ALL")}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="GRADED">Graded</SelectItem>
                  <SelectItem value="PENDING_GRADING">Pending Grading</SelectItem>
                  <SelectItem value="GRADING">Grading</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "createdAt" | "studentId" | "score")}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="studentId">Student ID</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading submissions...</div>
          ) : submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Info</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {submission.extractedStudentName || (
                                <span className="text-gray-400 italic">No name</span>
                              )}
                            </p>
                            {!submission.extractedStudentName && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs" variant="secondary">
                                Missing
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            ID: {submission.extractedStudentId || submission.studentIdentifier}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSubmission({
                            id: submission.id,
                            studentIdentifier: submission.studentIdentifier,
                            extractedStudentName: submission.extractedStudentName,
                            extractedStudentId: submission.extractedStudentId,
                            originalFilename: submission.originalFilename,
                          })}
                          title="Edit student information"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {submission.originalFilename}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {submission.grade && (submission.grade.finalScore != null || submission.grade.aiScore != null) ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {(submission.grade.finalScore ?? submission.grade.aiScore)?.toFixed(1)}/100
                          </span>
                          {getScoreTrend(submission.grade.finalScore ?? submission.grade.aiScore!)}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.grade?.aiConfidence != null ? (
                        <span className="text-sm">
                          {(submission.grade.aiConfidence * 100).toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(submission.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {submission.grade && (
                          <Link
                            href={`/courses/${courseId}/assignments/${assignmentId}/review?submissionId=${submission.id}`}
                          >
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this submission?")) {
                              deleteMutation.mutate({ id: submission.id });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No submissions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload student submissions to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Info Dialog */}
      {editingSubmission && (
        <EditStudentInfoDialog
          open={!!editingSubmission}
          onOpenChange={(open) => !open && setEditingSubmission(null)}
          submission={editingSubmission}
          onSuccess={() => {
            refetch();
            setEditingSubmission(null);
          }}
        />
      )}
    </div>
  );
}
