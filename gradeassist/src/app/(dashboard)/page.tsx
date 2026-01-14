"use client";

import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { BatchStatus } from "@prisma/client";

export default function DashboardPage() {
  // Fetch recent batches
  const { data: batches, isLoading: batchesLoading } = api.batch.list.useQuery({}, {
    refetchInterval: 5000, // Refresh every 5 seconds to show live updates
  });

  const recentBatches = batches?.slice(0, 5) || [];

  // Calculate stats from all batches
  const stats = {
    totalSubmissions: batches?.reduce((sum, b) => sum + b.totalSubmissions, 0) || 0,
    activeBatches: batches?.filter(b => b.status === BatchStatus.CONVERTING || b.status === BatchStatus.GRADING).length || 0,
    completedBatches: batches?.filter(b => b.status === BatchStatus.COMPLETED).length || 0,
  };

  const getStatusColor = (status: BatchStatus) => {
    switch (status) {
      case BatchStatus.UPLOADING:
        return "bg-blue-100 text-blue-700";
      case BatchStatus.CONVERTING:
        return "bg-yellow-100 text-yellow-700";
      case BatchStatus.GRADING:
        return "bg-purple-100 text-purple-700";
      case BatchStatus.COMPLETED:
        return "bg-green-100 text-green-700";
      case BatchStatus.FAILED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: BatchStatus) => {
    switch (status) {
      case BatchStatus.UPLOADING:
        return "Uploading";
      case BatchStatus.CONVERTING:
        return "Converting";
      case BatchStatus.GRADING:
        return "Grading";
      case BatchStatus.COMPLETED:
        return "Completed";
      case BatchStatus.FAILED:
        return "Failed";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Overview</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to Pointage
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload submissions, track batches, and review AI-assisted grades from
          a single dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Submissions"
          value={stats.totalSubmissions.toString()}
          helper={stats.totalSubmissions === 0 ? "Awaiting first upload" : "Across all batches"}
        />
        <StatCard
          label="Active Batches"
          value={stats.activeBatches.toString()}
          helper={stats.activeBatches === 0 ? "No batches running" : "Converting or grading"}
        />
        <StatCard
          label="Completed"
          value={stats.completedBatches.toString()}
          helper={stats.completedBatches === 0 ? "No completed batches" : "Successfully processed"}
        />
        <StatCard
          label="Total Batches"
          value={batches?.length.toString() || "0"}
          helper={!batches?.length ? "No batches yet" : "All time"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recent batches</p>
              <p className="text-base font-semibold text-gray-900">Latest activity</p>
            </div>
            <Link href="/batches" className="text-sm font-medium text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {batchesLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading batches...
            </div>
          ) : recentBatches.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentBatches.map((batch) => (
                <Link
                  key={batch.id}
                  href={`/batches/${batch.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Batch {batch.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {batch.totalSubmissions} submission{batch.totalSubmissions !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(batch.status)}`}>
                    {getStatusLabel(batch.status)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No batches yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Upload submissions to create your first batch
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Quick actions</p>
          <div className="space-y-2">
            <QuickAction label="View Courses" href="/courses" />
            <QuickAction label="Create Course" href="/courses/new" />
            <QuickAction label="Settings" href="/settings" />
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{helper}</p>
  </div>
);

const QuickAction = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800 transition hover:bg-gray-50"
  >
    <span>{label}</span>
    <span aria-hidden>→</span>
  </Link>
);
