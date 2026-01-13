"use client";

import { useEffect } from "react";
import { getPusherClient } from "@/lib/realtime/pusher-client";

type EventPayload = Record<string, unknown>;

export function useRealtimeUpdates(
  channel: string | null,
  handler: (payload: EventPayload) => void,
) {
  useEffect(() => {
    if (!channel) return undefined;

    const pusher = getPusherClient();
    const subscription = pusher.subscribe(channel);
    subscription.bind("event", handler);

    return () => {
      subscription.unbind("event", handler);
      pusher.unsubscribe(channel);
    };
  }, [channel, handler]);
}
