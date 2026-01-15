"use client";

import { api } from "@/lib/trpc/client";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function UsageTracking() {
  const { data: subscription, isLoading } = api.subscription.getCurrent.useQuery();
  const { data: usage } = api.subscription.getUsage.useQuery();

  if (isLoading) {
    return (
      <div className="dark-card rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="h-2 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !usage) {
    return null;
  }

  // Calculate limit and used submissions
  const limit = subscription.limits.maxSubmissionsPerSemester ?? 0;
  const used = usage.submissionsUsed ?? 0;
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isUnlimited = limit === null || limit === 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = used >= limit && !isUnlimited;

  return (
    <div className="dark-card rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400">Submission Usage</h3>
          <p className="text-2xl font-semibold text-white mt-1">
            {isUnlimited ? (
              <>
                {used.toLocaleString()} <span className="text-base text-gray-400">submissions</span>
              </>
            ) : (
              <>
                {used.toLocaleString()} <span className="text-base text-gray-400">/ {limit.toLocaleString()}</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isUnlimited ? "Unlimited submissions" : "This semester"}
          </p>
        </div>
        {isAtLimit && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Limit reached</span>
          </div>
        )}
        {!isAtLimit && !isUnlimited && isNearLimit && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">Near limit</span>
          </div>
        )}
        {!isAtLimit && !isUnlimited && !isNearLimit && percentage > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">On track</span>
          </div>
        )}
      </div>

      {!isUnlimited && (
        <>
          <Progress value={percentage} className="h-2 mb-3" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {(limit - used).toLocaleString()} submissions remaining
            </span>
            <span className="text-gray-500">{percentage.toFixed(0)}% used</span>
          </div>
        </>
      )}

      {isAtLimit && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-300 mb-2">
            You've reached your submission limit.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Upgrade plan →
          </Link>
        </div>
      )}
    </div>
  );
}
