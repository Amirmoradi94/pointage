"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface EditStudentInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: {
    id: string;
    studentIdentifier: string;
    extractedStudentName: string | null;
    extractedStudentId: string | null;
    originalFilename: string;
  };
  onSuccess?: () => void;
}

export function EditStudentInfoDialog({
  open,
  onOpenChange,
  submission,
  onSuccess,
}: EditStudentInfoDialogProps) {
  const [studentName, setStudentName] = useState(
    submission.extractedStudentName || ""
  );
  const [studentId, setStudentId] = useState(
    submission.extractedStudentId || submission.studentIdentifier
  );

  const updateMutation = api.submission.updateStudentInfo.useMutation({
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: submission.id,
      extractedStudentName: studentName.trim() || null,
      extractedStudentId: studentId.trim() || null,
    });
  };

  const wasExtracted = submission.extractedStudentName || submission.extractedStudentId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student Information</DialogTitle>
          <DialogDescription>
            Manually correct or update the student information for this submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Status */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">Current Status</p>
              {wasExtracted ? (
                <Badge className="bg-green-100 text-green-800" variant="secondary">
                  AI Extracted
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                  Not Extracted
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">
                  {submission.extractedStudentName || (
                    <span className="text-gray-400 italic">Not available</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">ID:</span>
                <span className="font-medium">
                  {submission.extractedStudentId || submission.studentIdentifier}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Filename:</span>
                <span className="font-medium text-xs truncate">
                  {submission.originalFilename}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                placeholder="Enter student's full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-gray-500">
                Enter the student's full name as it appears on the assignment
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter student ID number"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter the student's ID number (e.g., CS123456, 987654321)
              </p>
            </div>
          </div>

          {/* Warning if fields are empty */}
          {(!studentName.trim() || !studentId.trim()) && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> Leaving fields empty will result in "Not extracted"
                appearing in exports. It's recommended to fill both fields.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
