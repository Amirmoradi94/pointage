"use client";

import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/trpc/client";

export default function CoursesPage() {
  const { data: courses, isLoading } = api.course.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Courses</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your courses and assignments
            </p>
          </div>
          <Link href="/courses/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>
        <div className="text-center text-gray-400">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Courses</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your courses and assignments
          </p>
        </div>
        <Link href="/courses/new">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="dark-card cursor-pointer transition-all hover:scale-105 hover:border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                      <CardTitle className="text-lg text-white">{course.code}</CardTitle>
                    </div>
                    {course.isArchived && (
                      <Badge className="bg-gray-800 text-gray-400 border-gray-700">Archived</Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-400">{course.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      {course.semester} {course.year}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="dark-card border-dashed border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-600" />
            <p className="mt-4 text-sm font-medium text-white">No courses yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Create your first course to get started
            </p>
            <Link href="/courses/new">
              <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
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
