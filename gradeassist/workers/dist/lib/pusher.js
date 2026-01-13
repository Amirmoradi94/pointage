"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pusherServer = void 0;
const pusher_1 = __importDefault(require("pusher"));
const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const assertEnv = (value, name) => {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};
exports.pusherServer = new pusher_1.default({
    appId: assertEnv(appId, "PUSHER_APP_ID"),
    key: assertEnv(key, "NEXT_PUBLIC_PUSHER_KEY"),
    secret: assertEnv(secret, "PUSHER_SECRET"),
    cluster: assertEnv(cluster, "NEXT_PUBLIC_PUSHER_CLUSTER"),
    useTLS: true,
});
