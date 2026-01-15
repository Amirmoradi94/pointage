"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const features = [
  {
    category: "Usage Limits",
    items: [
      { name: "Submissions per Semester", free: "50", standard: "1,500", pro: "Unlimited", custom: "100-5,000" },
      { name: "Team Members", free: "1", standard: "1", pro: "Up to 5", custom: "1-10" },
    ],
  },
  {
    category: "AI Features",
    items: [
      { name: "AI-Powered Grading", free: true, standard: true, pro: true, custom: true },
      { name: "Rubric Customization", free: false, standard: true, pro: true, custom: true },
      { name: "Custom Grading Instructions", free: false, standard: true, pro: true, custom: true },
      { name: "Confidence Scoring", free: true, standard: true, pro: true, custom: true },
    ],
  },
  {
    category: "Export & Integration",
    items: [
      { name: "Export to CSV", free: true, standard: true, pro: true, custom: true },
      { name: "Bulk Upload", free: true, standard: true, pro: true, custom: true },
    ],
  },
  {
    category: "Support",
    items: [
      { name: "Email Support", free: true, standard: true, pro: true, custom: true },
      { name: "Priority Support", free: false, standard: true, pro: true, custom: true },
      { name: "Response Time", free: "72hr", standard: "24hr", pro: "12hr", custom: "24hr" },
    ],
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-emerald-400 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-gray-600 mx-auto" />
    );
  }
  return <span className="text-sm text-gray-300">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dark-card rounded-2xl overflow-hidden min-w-[700px]"
      >
        {/* Header */}
        <div className="grid grid-cols-5 bg-gray-900/50">
          <div className="p-6 text-left">
            <span className="text-sm font-semibold text-white">Features</span>
          </div>
          <div className="p-6 text-center border-l border-gray-800 bg-emerald-500/10">
            <span className="text-sm font-semibold text-emerald-400">Free</span>
            <p className="text-xs text-emerald-500 mt-1">$0 forever</p>
          </div>
          <div className="p-6 text-center border-l border-gray-800 bg-indigo-500/10">
            <span className="text-sm font-semibold text-indigo-400">Standard</span>
            <p className="text-xs text-indigo-500 mt-1">$8/mo</p>
          </div>
          <div className="p-6 text-center border-l border-gray-800">
            <span className="text-sm font-semibold text-white">Pro</span>
            <p className="text-xs text-gray-400 mt-1">$15/mo</p>
          </div>
          <div className="p-6 text-center border-l border-gray-800">
            <span className="text-sm font-semibold text-white">Custom</span>
            <p className="text-xs text-gray-400 mt-1">Dynamic</p>
          </div>
        </div>

        {/* Body */}
        {features.map((section) => (
          <div key={section.category}>
            {/* Category Header */}
            <div className="grid grid-cols-5 bg-gray-900/30 border-t border-gray-800">
              <div className="col-span-5 p-4 px-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.category}
                </span>
              </div>
            </div>

            {/* Items */}
            {section.items.map((item) => (
              <div key={item.name} className="grid grid-cols-5 border-t border-gray-800 hover:bg-gray-900/30 transition-colors">
                <div className="p-4 px-6">
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <div className="p-4 text-center border-l border-gray-800 bg-emerald-500/5">
                  <CellValue value={item.free} />
                </div>
                <div className="p-4 text-center border-l border-gray-800 bg-indigo-500/5">
                  <CellValue value={item.standard} />
                </div>
                <div className="p-4 text-center border-l border-gray-800">
                  <CellValue value={item.pro} />
                </div>
                <div className="p-4 text-center border-l border-gray-800">
                  <CellValue value={item.custom} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Price Row */}
        <div className="grid grid-cols-5 border-t-2 border-gray-700 bg-gray-900/50">
          <div className="p-6">
            <span className="text-sm font-semibold text-white">Price</span>
          </div>
          <div className="p-6 text-center border-l border-gray-800 bg-emerald-500/10">
            <span className="text-lg font-bold text-emerald-400">Free</span>
            <span className="text-xs text-emerald-500"> forever</span>
          </div>
          <div className="p-6 text-center border-l border-gray-800 bg-indigo-500/10">
            <span className="text-lg font-bold text-indigo-400">$8</span>
            <span className="text-xs text-indigo-500">/month</span>
          </div>
          <div className="p-6 text-center border-l border-gray-800">
            <span className="text-lg font-bold text-white">$15</span>
            <span className="text-xs text-gray-400">/month</span>
          </div>
          <div className="p-6 text-center border-l border-gray-800">
            <span className="text-lg font-bold text-white">Custom</span>
            <span className="text-xs text-gray-400">/month</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
