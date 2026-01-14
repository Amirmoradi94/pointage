"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    description: "Free forever - try Pointage",
    monthlyPrice: 0,
    semesterPrice: 0,
    features: [
      { text: "1 course", included: true },
      { text: "40 students", included: true },
      { text: "1 assignment", included: true },
      { text: "Basic AI grading", included: true },
      { text: "Email support", included: true },
      { text: "Export to CSV", included: true },
      { text: "Priority support", included: false },
    ],
    popular: false,
    cta: "Get Started",
    isFree: true,
  },
  {
    name: "Starter",
    description: "Perfect for small tutorials",
    monthlyPrice: 9,
    semesterPrice: 29,
    features: [
      { text: "1 course", included: true },
      { text: "30 students", included: true },
      { text: "8 assignments", included: true },
      { text: "Basic AI grading", included: true },
      { text: "Email support", included: true },
      { text: "Export to CSV", included: true },
      { text: "Priority support", included: false },
    ],
    popular: false,
    cta: "Start Free",
  },
  {
    name: "Standard",
    description: "Most popular for TAs",
    monthlyPrice: 15,
    semesterPrice: 49,
    features: [
      { text: "1 course", included: true },
      { text: "100 students", included: true },
      { text: "15 assignments", included: true },
      { text: "Advanced AI grading", included: true },
      { text: "Rubric customization", included: true },
      { text: "Export to CSV", included: true },
      { text: "Priority support", included: true },
    ],
    popular: true,
    cta: "Start Free",
  },
  {
    name: "Pro",
    description: "For full-time TAs & instructors",
    monthlyPrice: 25,
    semesterPrice: 79,
    features: [
      { text: "3 courses", included: true },
      { text: "Unlimited students", included: true },
      { text: "Unlimited assignments", included: true },
      { text: "Advanced AI grading", included: true },
      { text: "Team collaboration (3 TAs)", included: true },
      { text: "Export to CSV", included: true },
      { text: "Priority support", included: true },
    ],
    popular: false,
    cta: "Start Free",
  },
];

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative w-14 h-7 rounded-full bg-slate-200 transition-colors"
        >
          <motion.div
            animate={{ x: isAnnual ? 28 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg"
          />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
          Semester
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
            Save 35%
          </span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl ${
              plan.popular
                ? "glass-card border-2 border-indigo-200 shadow-xl shadow-indigo-500/10"
                : "glass-card"
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg">
                  <Sparkles className="h-4 w-4" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-slate-900">
                    ${isAnnual ? plan.semesterPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-slate-500">
                    /{isAnnual ? "semester" : "month"}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-slate-400 mt-1">
                    ~${Math.round(plan.semesterPrice / 4)}/month
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <Check 
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        feature.included ? 'text-emerald-500' : 'text-slate-300'
                      }`} 
                    />
                    <span className={`text-sm ${
                      feature.included ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/sign-up">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
