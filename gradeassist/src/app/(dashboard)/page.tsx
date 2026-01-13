const recentBatches = [
  { id: "b1", name: "Assignment 1", status: "CONVERTING", progress: "3/10 graded" },
  { id: "b2", name: "Assignment 2", status: "COMPLETED", progress: "10/10 graded" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Overview</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to GradeAssist AI
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload submissions, track batches, and review AI-assisted grades from
          a single dashboard.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Submissions" value="0" helper="Awaiting first upload" />
        <StatCard label="Batches" value="0" helper="No batches running" />
        <StatCard label="Grades ready" value="0" helper="Review queue is empty" />
        <StatCard label="Avg confidence" value="—" helper="Pending AI runs" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recent batches</p>
              <p className="text-base font-semibold text-gray-900">Latest activity</p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBatches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                  <p className="text-xs text-gray-500">{batch.progress}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {batch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Quick actions</p>
          <div className="space-y-2">
            <QuickAction label="Upload submissions" />
            <QuickAction label="Create assignment" />
            <QuickAction label="Review grades" />
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

const QuickAction = ({ label }: { label: string }) => (
  <button className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800 transition hover:bg-gray-50">
    <span>{label}</span>
    <span aria-hidden>→</span>
  </button>
);
