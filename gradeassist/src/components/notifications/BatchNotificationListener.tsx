"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useToast } from "@/hooks/use-toast";

// This component listens for batch completions globally
// It uses localStorage to track active batches across page navigations
export function BatchNotificationListener() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeBatches, setActiveBatches] = useState<string[]>([]);

  useEffect(() => {
    // Load active batches from localStorage
    const storedBatches = localStorage.getItem("activeBatches");
    if (storedBatches) {
      setActiveBatches(JSON.parse(storedBatches));
    }

    // Listen for new batches being added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "activeBatches" && e.newValue) {
        setActiveBatches(JSON.parse(e.newValue));
      }
    };

    // Listen for custom events from same window
    const handleBatchAdded = (e: CustomEvent) => {
      const storedBatches = localStorage.getItem("activeBatches");
      if (storedBatches) {
        setActiveBatches(JSON.parse(storedBatches));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("batchAdded" as any, handleBatchAdded);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("batchAdded" as any, handleBatchAdded);
    };
  }, []);

  useEffect(() => {
    if (activeBatches.length === 0) return;

    // Request notification permission if not already granted
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channels: any[] = [];

    // Subscribe to each active batch
    activeBatches.forEach((batchId) => {
      const channel = pusher.subscribe(`batch-${batchId}`);
      channels.push(channel);

      // Listen for batch completion
      channel.bind("batch_complete", (data: any) => {
        const { summary } = data;

        // Play notification sound
        if (typeof Audio !== "undefined") {
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => {
            // Ignore if audio fails
          });
        }

        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Pointage - Batch Complete", {
            body: `${summary.graded} of ${summary.totalSubmissions} submissions graded.`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          });
        }

        // Show toast notification
        toast({
          title: "🎉 Batch Processing Complete!",
          description: (
            <div className="mt-2 space-y-1">
              <p>
                {summary.graded} of {summary.totalSubmissions} submissions graded
              </p>
              {summary.failed > 0 && (
                <p className="text-sm text-red-600">
                  {summary.failed} failed
                </p>
              )}
              <p className="text-sm text-gray-600">
                Average score: {summary.averageScore?.toFixed(1) || 0}/100
              </p>
              <p className="text-sm text-gray-600">
                Average confidence: {((summary.averageConfidence || 0) * 100).toFixed(0)}%
              </p>
              <button
                onClick={() => router.push(`/batches/${batchId}`)}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline"
              >
                View Results →
              </button>
            </div>
          ),
          duration: 10000,
        });

        // Remove from active batches
        removeActiveBatch(batchId);
      });
    });

    return () => {
      channels.forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
      pusher.disconnect();
    };
  }, [activeBatches, toast, router]);

  return null; // Non-visual component
}

// Helper functions to manage active batches
export function addActiveBatch(batchId: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("activeBatches");
  const batches = stored ? JSON.parse(stored) : [];
  if (!batches.includes(batchId)) {
    batches.push(batchId);
    localStorage.setItem("activeBatches", JSON.stringify(batches));

    // Dispatch custom event for same-window updates
    window.dispatchEvent(new CustomEvent("batchAdded", { detail: { batchId } }));
  }
}

export function removeActiveBatch(batchId: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("activeBatches");
  const batches = stored ? JSON.parse(stored) : [];
  const filtered = batches.filter((id: string) => id !== batchId);
  localStorage.setItem("activeBatches", JSON.stringify(filtered));

  // Dispatch custom event for same-window updates
  window.dispatchEvent(new CustomEvent("batchRemoved", { detail: { batchId } }));
}
