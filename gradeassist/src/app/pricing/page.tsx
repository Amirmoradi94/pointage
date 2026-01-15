"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PackageBuilder } from "@/components/pricing/PackageBuilder";
import { ComparisonTable } from "@/components/pricing/ComparisonTable";
import { PlanType } from "@prisma/client";

const faqs = [
  {
    question: "What counts as a 'student' in my plan?",
    answer: "A student is anyone who submits work to be graded. If a student submits multiple assignments, they're still counted as one student.",
  },
  {
    question: "Can I change my plan mid-semester?",
    answer: "Yes! You can upgrade anytime and we'll prorate the difference. Downgrades take effect at the start of the next billing cycle.",
  },
  {
    question: "What happens if I exceed my limits?",
    answer: "We'll notify you when you're approaching limits. You can upgrade or add more capacity without losing any data.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! We offer a Free plan with 50 submissions per semester. No credit card required to get started.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Our pricing is already optimized for students and TAs. However, contact us for special academic institution rates.",
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
];

export default function PricingPage() {
  const searchParams = useSearchParams();
  const upgradeFrom = searchParams.get("upgrade") as PlanType | null;
  
  const isUpgradePage = !!upgradeFrom;
  
  const getUpgradeTitle = () => {
    switch (upgradeFrom) {
      case PlanType.FREE:
        return "Upgrade from Free Plan";
      case PlanType.STARTER:
        return "Upgrade from Starter Plan";
      case PlanType.STANDARD:
        return "Upgrade from Standard Plan";
      default:
        return "Upgrade Your Plan";
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Link href={isUpgradePage ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-6">
                <ArrowLeft className="h-4 w-4" />
                {isUpgradePage ? "Back to Dashboard" : "Back to Home"}
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {isUpgradePage ? (
                  <>
                    {getUpgradeTitle()}
                    <span className="text-gradient-purple"> - Upgrade Now</span>
                  </>
                ) : (
                  <>
                    Simple, transparent{" "}
                    <span className="text-gradient-purple">pricing</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-gray-400">
                {isUpgradePage
                  ? "Choose a higher plan to unlock more features and capacity."
                  : "Choose a plan that fits your teaching load. Start with our Free plan."
                }
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingCards upgradeFrom={upgradeFrom} />
          </div>
        </section>

        {/* Custom Package Builder */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/30 mb-4">
                Custom Plans
              </span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Build your own package
              </h2>
              <p className="text-gray-400">
                Need something different? Configure exactly what you need and see your price in real-time.
              </p>
            </motion.div>

            <div className="max-w-xl mx-auto">
              <PackageBuilder />
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Compare plans
              </h2>
              <p className="text-gray-400">
                See everything that's included in each plan.
              </p>
            </motion.div>

            <ComparisonTable />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Pricing FAQ
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.details
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group dark-card rounded-xl"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-medium text-white">{faq.question}</span>
                    <span className="ml-4 flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="dark-card rounded-2xl p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to save hours every week?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Join hundreds of TAs who've reclaimed their weekends with Pointage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 px-8"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
