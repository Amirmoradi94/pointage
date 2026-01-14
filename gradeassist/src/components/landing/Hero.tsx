"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-hero-dark">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Save 70% of time</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-300">Trusted by TAs</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 mb-8"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-200">
              AI-Powered Grading Assistant for University TAs
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            All-in-One AI Platform
            <br />
            <span className="text-gradient-purple">For University TAs</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Grade assignments with AI, review with one click, and get your weekends back.
            <span className="block mt-2 text-indigo-300">
              Gemini AI, custom rubrics, and batch processing — all in one workspace.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/sign-in">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 px-8 text-base glow-purple"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-900 hover:border-gray-600 hover:text-white px-8 text-base"
              >
                View Pricing
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm text-gray-500"
          >
            No credit card required • Free forever plan available • Start grading in minutes
          </motion.p>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-16 relative"
          >
            {/* Main Dashboard Card */}
            <div className="dark-card rounded-2xl p-8 shadow-2xl glow-purple max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Assignment</p>
                  <h3 className="text-2xl font-semibold text-white">Computer Science 101 - Midterm</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI Grading...
                </div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium text-white">94/100 graded</span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  />
                </div>
              </div>

              {/* Sample Submissions */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { name: "Sarah Chen", score: 92, status: "Approved", color: "emerald" },
                  { name: "Marcus Johnson", score: 78, status: "Review", color: "amber" },
                  { name: "Emily Rodriguez", score: 88, status: "Approved", color: "emerald" },
                ].map((student, i) => (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium text-white">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{student.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{student.score}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        student.color === "emerald" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">85</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">94%</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">AI Confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-400 mb-1">2.5h</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Time Saved</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
