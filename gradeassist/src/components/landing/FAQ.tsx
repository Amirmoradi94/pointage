"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How accurate is the AI grading?",
    answer:
      "Pointage uses Google's Gemini AI with 98%+ accuracy on most assignment types. The AI analyzes submissions against your custom rubric and provides confidence scores. Low-confidence grades are flagged for human review, ensuring quality.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support PDF, DOCX, DOC, JPG, PNG, and most common image formats. Our system automatically converts files to a format the AI can analyze, and extracts student information from filenames.",
  },
  {
    question: "How does pricing work?",
    answer:
      "We offer a free forever plan (1 course, 40 students, 1 assignment) and paid plans starting at $49/semester. You only pay for what you need - no hidden fees, no per-submission charges. Cancel anytime.",
  },
  {
    question: "Can I customize the AI's grading style?",
    answer:
      "Absolutely! You can adjust strictness levels, enable/disable partial credit, set confidence thresholds, and provide custom instructions. The AI adapts to your specific grading preferences.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All submissions are encrypted at rest and in transit. We never use your data to train AI models. Your submissions are automatically deleted after the semester ends (configurable retention).",
  },
  {
    question: "How long does grading take?",
    answer:
      "Most assignments are graded within minutes, not hours. A batch of 100 submissions typically takes 5-10 minutes to process. You'll get real-time notifications when grading is complete.",
  },
  {
    question: "Can I integrate with my LMS?",
    answer:
      "While we don't have direct LMS integrations yet, you can easily export grades to CSV format that's compatible with Canvas, Blackboard, Moodle, and other learning management systems.",
  },
  {
    question: "What if the AI makes a mistake?",
    answer:
      "You have full control to review and adjust any grade. The AI provides detailed reasoning for each score, making it easy to verify. You can override grades with one click and provide additional feedback.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-dark relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
            <HelpCircle className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Got Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Frequently Asked{" "}
            <span className="text-gradient-purple">Questions</span>
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about Pointage
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="dark-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-gray-800 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:support@pointage.com"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
