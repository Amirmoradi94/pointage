"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradingQueue = void 0;
const bullmq_1 = require("bullmq");
const conversion_queue_1 = require("./conversion.queue");
exports.gradingQueue = new bullmq_1.Queue("grading", {
    connection: conversion_queue_1.connection,
    defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
    },
});
