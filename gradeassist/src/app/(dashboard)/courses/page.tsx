"use client";

import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockCourses = [
  { id: "1", name: "Introduction to Computer Science", code: "CS101", semester: "Fall", year: 2024, assignmentCount: 5, isArchived: false },
  { id: "2", name: "Data Structures and Algorithms", code: "CS201", semester: "Fall", year: 2024, assignmentCount: 8, isArchived: false },
  { id: "3", name: "Database Systems", code: "CS301", semester: "Spring", year: 2024, assignmentCount: 3, isArchived: true },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your courses and assignments
          </p>
        </div>
        <Link href="/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                  </div>
                  {course.isArchived && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                </div>
                <CardDescription>{course.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {course.semester} {course.year}
                  </span>
                  <span>{course.assignmentCount} assignments</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {mockCourses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm font-medium text-gray-900">No courses yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first course to get started
            </p>
            <Link href="/courses/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
