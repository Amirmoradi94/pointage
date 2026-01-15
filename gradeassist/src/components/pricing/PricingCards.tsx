"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanType } from "@prisma/client";

const plans = [
  {
    name: "Free",
    planType: PlanType.FREE,
    description: "Try Pointage risk-free",
    monthlyPrice: 0,
    semesterPrice: 0,
    originalMonthlyPrice: 0,
    submissions: "50",
    features: [
      { text: "50 submissions/semester", included: true },
      { text: "1 team member", included: true },
      { text: "AI-powered grading", included: true },
      { text: "Export to CSV", included: true },
      { text: "Email support", included: true },
    ],
    popular: false,
    cta: "Get Started",
    isFree: true,
  },
  {
    name: "Standard",
    planType: PlanType.STANDARD,
    description: "Most popular for TAs",
    monthlyPrice: 8,
    semesterPrice: 32,
    originalMonthlyPrice: 13,
    submissions: "1,500",
    features: [
      { text: "1,500 submissions/semester", included: true },
      { text: "1 team member", included: true },
      { text: "AI-powered grading", included: true },
      { text: "Rubric customization", included: true },
      { text: "Export to CSV", included: true },
      { text: "Priority email support", included: true },
    ],
    popular: true,
    cta: "Start Free",
  },
  {
    name: "Pro",
    planType: PlanType.PRO,
    description: "For full-time TAs & instructors",
    monthlyPrice: 15,
    semesterPrice: 60,
    originalMonthlyPrice: 25,
    submissions: "Unlimited",
    features: [
      { text: "Unlimited submissions", included: true },
      { text: "Up to 5 team members", included: true },
      { text: "AI-powered grading", included: true },
      { text: "Rubric customization", included: true },
      { text: "Export to CSV", included: true },
      { text: "Priority email support", included: true },
    ],
    popular: false,
    cta: "Start Free",
  },
];

const planOrder: Record<PlanType, number> = {
  [PlanType.FREE]: 0,
  [PlanType.STARTER]: 1,
  [PlanType.STANDARD]: 2,
  [PlanType.PRO]: 3,
  [PlanType.CUSTOM]: 4,
};

interface PricingCardsProps {
  upgradeFrom?: PlanType | null;
}

export function PricingCards({ upgradeFrom }: PricingCardsProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const filteredPlans = useMemo(() => {
    if (!upgradeFrom) {
      return plans;
    }

    const currentPlanOrder = planOrder[upgradeFrom] ?? 0;
    return plans.filter(plan => {
      const planOrderValue = planOrder[plan.planType];
      return planOrderValue > currentPlanOrder;
    });
  }, [upgradeFrom]);

  return (
    <div>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="dark-card rounded-full p-1 inline-flex relative">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              !isAnnual
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isAnnual
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
      </div>

      {/* Cards */}
      <div className={`grid gap-8 ${filteredPlans.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : filteredPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
        {filteredPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
                  <Sparkles className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-8">
              {/* Header */}
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
                      {isAnnual ? (
                        <>
                          <span className="text-xl font-bold text-gray-500 line-through">
                            ${plan.originalMonthlyPrice}.00
                          </span>
                          <span className="text-5xl font-bold text-white">
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-gray-400">/month</span>
                        </>
                      ) : (
                        <>
                          <span className="text-5xl font-bold text-white">
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-gray-400">/month</span>
                        </>
                      )}
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-gray-500">
                        Billed per semester (${plan.semesterPrice})
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        feature.included ? 'text-emerald-400' : 'text-gray-600'
                      }`}
                    />
                    <span className={`text-sm ${
                      feature.included ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {feature.text}
                    </span>
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
                <Link href="/sign-up">
                  {plan.cta}
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
