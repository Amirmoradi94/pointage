"use client";

import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, FileText, Info } from "lucide-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/trpc/client";
import { useToast } from "@/hooks/use-toast";
import { STRICTNESS_LEVELS } from "@/lib/constants";

const MAX_SOLUTION_SIZE = 50 * 1024 * 1024; // 50MB

export default function NewAssignmentPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Solution file state
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // AI Settings state
  const [strictness, setStrictness] = useState("moderate");
  const [partialCredit, setPartialCredit] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [customInstructions, setCustomInstructions] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > MAX_SOLUTION_SIZE) {
        toast({
          title: "File too large",
          description: "Solution file must be under 50MB",
          variant: "destructive",
        });
        return;
      }
      setSolutionFile(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const removeSolutionFile = () => {
    setSolutionFile(null);
    setUploadProgress(0);
  };

  const uploadSolutionFile = async (assignmentId: string): Promise<string | null> => {
    if (!solutionFile) return null;

    try {
      // Get signed upload URL
      const response = await fetch("/api/upload/solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: solutionFile.name,
          contentType: solutionFile.type || "application/octet-stream",
          size: solutionFile.size,
          assignmentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { signedUrl, path, publicUrl } = await response.json();

      // Upload via XHR for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", solutionFile.type || "application/octet-stream");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(solutionFile);
      });

      return publicUrl;
    } catch (error) {
      console.error("Solution upload error:", error);
      throw error;
    }
  };

  const setSolutionMutation = api.assignment.setSolution.useMutation();

  const createAssignmentMutation = api.assignment.create.useMutation({
    onSuccess: async (assignment) => {
      try {
        // Upload solution file if provided
        if (solutionFile) {
          setUploadProgress(0);
          const publicUrl = await uploadSolutionFile(assignment.id);
          
          // Save solution reference to database
          if (publicUrl) {
            await setSolutionMutation.mutateAsync({
              assignmentId: assignment.id,
              fileUrl: publicUrl,
              filename: solutionFile.name,
            });
          }
        }

        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
        router.push(`/courses/${courseId}`);
      } catch (error) {
        toast({
          title: "Warning",
          description: "Assignment created but solution upload failed. You can upload it later.",
          variant: "destructive",
        });
        router.push(`/courses/${courseId}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;
    const maxScore = formData.get("maxScore") as string;

    // Build grading settings
    const gradingSettings = {
      strictness,
      partialCredit,
      confidenceThreshold: confidenceThreshold[0],
      customInstructions: customInstructions.trim() || undefined,
    };

    createAssignmentMutation.mutate({
      courseId,
      title,
      description: description || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      maxScore: maxScore ? parseFloat(maxScore) : 100,
      gradingSettings,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/courses/${courseId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Assignment</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new assignment to this course
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Information</CardTitle>
            <CardDescription>
              Enter the basic details for your assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Assignment 1: Variables and Data Types"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the assignment..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  placeholder="100"
                  defaultValue={100}
                  min={0}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution/Rubric Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Solution / Rubric
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Upload the answer key, rubric, or grading guide. The AI will use this to grade submissions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              Upload the answer key or rubric for AI grading reference
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!solutionFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700">
                  {isDragActive ? "Drop the file here" : "Drag and drop your solution file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOCX, images, or any file type up to 50MB
                </p>
                <Button type="button" variant="outline" className="mt-3">
                  Browse files
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{solutionFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(solutionFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeSolutionFile}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Grading Settings */}
        <Card>
          <CardHeader>
            <CardTitle>AI Grading Settings</CardTitle>
            <CardDescription>
              Configure how the AI should grade submissions for this assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strictness Level */}
            <div className="space-y-3">
              <Label>Strictness Level</Label>
              <Select value={strictness} onValueChange={setStrictness}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STRICTNESS_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <span>{level.label}</span>
                        <span className="text-xs text-gray-500">— {level.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Partial Credit */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Partial Credit</Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Allow partial points for partially correct answers
                </p>
              </div>
              <Button
                type="button"
                variant={partialCredit ? "default" : "outline"}
                size="sm"
                onClick={() => setPartialCredit(!partialCredit)}
              >
                {partialCredit ? "Enabled" : "Disabled"}
              </Button>
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Confidence Threshold</Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Grades below this confidence will be flagged for review
                  </p>
                </div>
                <Badge variant="secondary">{confidenceThreshold[0]}%</Badge>
              </div>
              <Slider
                value={confidenceThreshold}
                onValueChange={setConfidenceThreshold}
                min={50}
                max={95}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>50% (flag more)</span>
                <span>95% (flag less)</span>
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <Label htmlFor="customInstructions">Custom Grading Instructions</Label>
              <Textarea
                id="customInstructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add any specific grading criteria or instructions for the AI...

Examples:
- Accept both metric and imperial units
- Deduct 5 points for missing units
- Focus on methodology over final answer"
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                These instructions will be included in the AI grading prompt
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Link href={`/courses/${courseId}`}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              solutionFile && uploadProgress > 0 ? (
                `Uploading... ${uploadProgress}%`
              ) : (
                "Creating..."
              )
            ) : (
              "Create Assignment"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
