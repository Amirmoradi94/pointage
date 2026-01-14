"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PackageBuilder } from "@/components/pricing/PackageBuilder";
import { ComparisonTable } from "@/components/pricing/ComparisonTable";

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
    question: "Is there a free trial?",
    answer: "Yes! All plans include a 14-day free trial with full access to features. No credit card required to start.",
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
  return (
    <div className="min-h-screen bg-landing-gradient">
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
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Simple, transparent{" "}
                <span className="text-gradient-brand">pricing</span>
              </h1>
              <p className="text-lg text-slate-600">
                Choose a plan that fits your teaching load. All plans include a free trial.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingCards />
          </div>
        </section>

        {/* Custom Package Builder */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-violet-100 text-violet-700 mb-4">
                Custom Plans
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Build your own package
              </h2>
              <p className="text-slate-600">
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Compare plans
              </h2>
              <p className="text-slate-600">
                See everything that's included in each plan.
              </p>
            </motion.div>

            <ComparisonTable />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
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
                  className="group glass-card rounded-xl"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-medium text-slate-900">{faq.question}</span>
                    <span className="ml-4 flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-slate-600">{faq.answer}</p>
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
              className="glass-card rounded-2xl p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to save hours every week?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Join hundreds of TAs who've reclaimed their weekends with Pointage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 px-8"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button size="lg" variant="outline">
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
