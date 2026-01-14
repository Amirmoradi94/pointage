"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    pricePerSemester: 0,
    period: "forever",
    description: "Try Pointage risk-free",
    features: [
      "1 course",
      "40 students",
      "1 assignment",
      "Basic AI grading",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Standard",
    pricePerSemester: 49,
    period: "semester",
    description: "Most popular for TAs",
    features: [
      "1 course",
      "100 students",
      "15 assignments",
      "Advanced rubric customization",
      "Priority support",
      "Export to CSV",
    ],
    cta: "Start Free",
    popular: true,
  },
  {
    name: "Pro",
    pricePerSemester: 79,
    period: "semester",
    description: "For full-time TAs",
    features: [
      "3 courses",
      "Unlimited students",
      "Unlimited assignments",
      "Team collaboration (3 TAs)",
      "Priority support",
      "Export to CSV",
    ],
    cta: "Start Free",
    popular: false,
  },
];

const comparisonData = [
  {
    name: "Manual Grading",
    price: "Free",
    timePerStudent: "15 min",
    totalTime: "25 hours",
    accuracy: "Variable",
    feedback: "Inconsistent",
    stress: "High",
    highlight: false,
  },
  {
    name: "Pointage",
    price: "$49/sem",
    timePerStudent: "30 sec",
    totalTime: "50 minutes",
    accuracy: "98%+",
    feedback: "Consistent",
    stress: "Minimal",
    highlight: true,
  },
];

export function PricingPreview() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "semester">("semester");

  return (
    <section id="pricing" className="py-24 bg-dark relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            One Subscription
            <br />
            <span className="text-gradient-purple">To Replace Manual Grading</span>
          </h2>
          <p className="text-lg text-gray-400">
            Pay only 4% of your TA salary to save 70% of your grading time.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 max-w-4xl mx-auto"
        >
          <div className="dark-card rounded-2xl p-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-sm font-medium text-gray-400 uppercase tracking-wide">
                      Method
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-gray-400 uppercase tracking-wide">
                      Cost
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-gray-400 uppercase tracking-wide">
                      Time/Student
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-gray-400 uppercase tracking-wide">
                      For 100 Students
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-gray-400 uppercase tracking-wide">
                      Accuracy
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-gray-400 uppercase tracking-wide">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr
                      key={row.name}
                      className={`border-b border-gray-800 last:border-b-0 ${
                        row.highlight ? "bg-gradient-to-r from-indigo-500/5 to-purple-500/5" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {row.highlight && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">{row.name}</p>
                            {row.highlight && (
                              <p className="text-xs text-indigo-400">Recommended</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-semibold ${row.highlight ? "text-emerald-400" : "text-white"}`}>
                          {row.price}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-semibold ${row.highlight ? "text-emerald-400" : "text-gray-300"}`}>
                          {row.timePerStudent}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-semibold ${row.highlight ? "text-emerald-400" : "text-gray-300"}`}>
                          {row.totalTime}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-semibold ${row.highlight ? "text-emerald-400" : "text-gray-300"}`}>
                          {row.accuracy}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-semibold ${row.highlight ? "text-emerald-400" : "text-gray-300"}`}>
                          {row.feedback}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Save <span className="text-emerald-400 font-semibold">24+ hours per semester</span> with Pointage
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="dark-card rounded-full p-1 inline-flex relative">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("semester")}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                billingPeriod === "semester"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap">
                40% OFF
              </span>
              Semester
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? "dark-card border-2 border-purple-500 shadow-xl shadow-purple-500/30"
                  : "dark-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-xl">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  {plan.name === "Free" ? (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-white">
                        $0
                      </span>
                      <span className="text-gray-400">/forever</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        {billingPeriod === "semester" ? (
                          <>
                            <span className="text-xl font-bold text-gray-500 line-through">
                              ${Math.round(plan.pricePerSemester / 4)}.00
                            </span>
                            <span className="text-5xl font-bold text-white">
                              ${(plan.pricePerSemester * 0.6 / 4).toFixed(2)}
                            </span>
                            <span className="text-gray-400">/month</span>
                          </>
                        ) : (
                          <>
                            <span className="text-5xl font-bold text-white">
                              ${Math.round(plan.pricePerSemester / 4)}
                            </span>
                            <span className="text-gray-400">/month</span>
                          </>
                        )}
                      </div>
                      {billingPeriod === "semester" && (
                        <p className="text-sm text-gray-500">
                          Billed per semester (${(plan.pricePerSemester * 0.6).toFixed(2)})
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  }`}
                >
                  <Link href="/sign-in">
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Plan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            Need a custom plan? Build your own package with our calculator.
          </p>
          <Link href="/pricing">
            <Button className="group bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-900 hover:border-gray-600 hover:text-white">
              Build Custom Plan
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
