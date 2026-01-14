"use client";

import { motion } from "framer-motion";
import { Upload, Settings, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Submissions",
    description:
      "Drop your student submissions (PDF, DOCX, images) in bulk. Pointage automatically extracts student info from filenames.",
    color: "indigo",
  },
  {
    number: "02",
    icon: Settings,
    title: "Set Your Rubric",
    description:
      "Upload your grading rubric and solution. Configure AI settings like strictness, partial credit, and custom instructions.",
    color: "purple",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI Grades Everything",
    description:
      "Gemini AI analyzes each submission against your rubric, providing grades, feedback, and confidence scores in minutes.",
    color: "yellow",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Review & Export",
    description:
      "Review AI suggestions, adjust grades with one click, and export final results to CSV for your LMS integration.",
    color: "emerald",
  },
];

const colorClasses: Record<string, {bg: string, icon: string, border: string, glow: string}> = {
  indigo: { 
    bg: "bg-indigo-500/10", 
    icon: "text-indigo-400", 
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/20"
  },
  purple: { 
    bg: "bg-purple-500/10", 
    icon: "text-purple-400", 
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20"
  },
  yellow: { 
    bg: "bg-yellow-500/10", 
    icon: "text-yellow-400", 
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/20"
  },
  emerald: { 
    bg: "bg-emerald-500/10", 
    icon: "text-emerald-400", 
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20"
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-dark relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How Pointage{" "}
            <span className="text-gradient-purple">Works</span>
          </h2>
          <p className="text-lg text-gray-400">
            Get started in minutes. No complex setup, no training required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-16 left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = colorClasses[step.color];
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step Number Circle */}
                  <div className="flex justify-center mb-6">
                    <div className={`relative w-16 h-16 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center shadow-xl ${colors.glow}`}>
                      <Icon className={`h-8 w-8 ${colors.icon}`} />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Ready to save hours every week?
          </p>
          <a
            href="/sign-in"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all text-lg"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Start grading in minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
