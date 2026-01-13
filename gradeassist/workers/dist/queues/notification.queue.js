"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQueue = void 0;
const bullmq_1 = require("bullmq");
const conversion_queue_1 = require("./conversion.queue");
exports.notificationQueue = new bullmq_1.Queue("notification", {
    connection: conversion_queue_1.connection,
    defaultJobOptions: {
        removeOnComplete: true,
        attempts: 2,
    },
});
