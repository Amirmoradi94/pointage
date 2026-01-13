"use client";

import PusherClient from "pusher-js";

let client: PusherClient | null = null;

export const getPusherClient = () => {
  if (client) return client;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  if (!key || !cluster) {
    throw new Error("Missing NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER");
  }

  client = new PusherClient(key, {
    cluster,
    forceTLS: true,
  });

  return client;
};
