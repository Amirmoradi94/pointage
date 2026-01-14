"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  Brain,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Grading",
    description:
      "Gemini AI analyzes submissions against your rubric and provides accurate grades with detailed feedback in seconds.",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "Batch Processing",
    description:
      "Upload 100+ submissions at once. Our system processes them in parallel, saving you hours of manual work.",
    color: "yellow",
  },
  {
    icon: CheckCircle2,
    title: "Human-in-the-Loop",
    description:
      "Review and adjust AI suggestions with one click. You stay in control while AI does the heavy lifting.",
    color: "emerald",
  },
  {
    icon: FileText,
    title: "Custom Rubrics",
    description:
      "Upload your own rubrics and solutions. AI adapts to your specific grading criteria and expectations.",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Confidence Scoring",
    description:
      "AI provides confidence levels for each grade. Flag low-confidence submissions for extra review.",
    color: "blue",
  },
  {
    icon: Clock,
    title: "Real-time Progress",
    description:
      "Track grading progress live with notifications. Know exactly when each batch is complete.",
    color: "orange",
  },
  {
    icon: Users,
    title: "Student Management",
    description:
      "Automatically extract student info from filenames. Organize submissions by student and assignment.",
    color: "pink",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "View class performance, identify struggling students, and export grades to CSV for your LMS.",
    color: "cyan",
  },
];

const colorClasses: Record<string, {bg: string, icon: string, border: string}> = {
  indigo: { bg: "bg-indigo-500/10", icon: "text-indigo-400", border: "border-indigo-500/30" },
  yellow: { bg: "bg-yellow-500/10", icon: "text-yellow-400", border: "border-yellow-500/30" },
  emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400", border: "border-emerald-500/30" },
  purple: { bg: "bg-purple-500/10", icon: "text-purple-400", border: "border-purple-500/30" },
  blue: { bg: "bg-blue-500/10", icon: "text-blue-400", border: "border-blue-500/30" },
  orange: { bg: "bg-orange-500/10", icon: "text-orange-400", border: "border-orange-500/30" },
  pink: { bg: "bg-pink-500/10", icon: "text-pink-400", border: "border-pink-500/30" },
  cyan: { bg: "bg-cyan-500/10", icon: "text-cyan-400", border: "border-cyan-500/30" },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-dark relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Everything You Need</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Powerful Features for{" "}
            <span className="text-gradient-purple">Modern TAs</span>
          </h2>
          <p className="text-lg text-gray-400">
            From AI grading to analytics, Pointage has everything you need to grade smarter and faster.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group dark-card rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            And many more features to help you grade efficiently
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            See all features in pricing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
