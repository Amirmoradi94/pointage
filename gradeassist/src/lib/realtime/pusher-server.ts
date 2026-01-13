import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

const assertEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const pusherServer = new Pusher({
  appId: assertEnv(appId, "PUSHER_APP_ID"),
  key: assertEnv(key, "NEXT_PUBLIC_PUSHER_KEY"),
  secret: assertEnv(secret, "PUSHER_SECRET"),
  cluster: assertEnv(cluster, "NEXT_PUBLIC_PUSHER_CLUSTER"),
  useTLS: true,
});
