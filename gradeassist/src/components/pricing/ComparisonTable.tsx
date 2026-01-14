"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const features = [
  {
    category: "Usage Limits",
    items: [
      { name: "Courses", free: "1", starter: "1", standard: "1", pro: "3", custom: "1-10" },
      { name: "Students per Course", free: "40", starter: "30", standard: "100", pro: "Unlimited", custom: "10-500" },
      { name: "Assignments per Course", free: "1", starter: "8", standard: "15", pro: "Unlimited", custom: "5-30" },
      { name: "Team Members", free: "1", starter: "1", standard: "1", pro: "3", custom: "1-10" },
    ],
  },
  {
    category: "AI Features",
    items: [
      { name: "AI Grading", free: "Basic", starter: "Basic", standard: "Advanced", pro: "Advanced", custom: "Advanced" },
      { name: "Rubric Customization", free: false, starter: false, standard: true, pro: true, custom: true },
      { name: "Custom Grading Instructions", free: false, starter: false, standard: true, pro: true, custom: true },
      { name: "Confidence Scoring", free: true, starter: true, standard: true, pro: true, custom: true },
    ],
  },
  {
    category: "Export",
    items: [
      { name: "Export to CSV", free: true, starter: true, standard: true, pro: true, custom: true },
    ],
  },
  {
    category: "Support",
    items: [
      { name: "Email Support", free: true, starter: true, standard: true, pro: true, custom: true },
      { name: "Priority Support", free: false, starter: false, standard: true, pro: true, custom: "Optional" },
      { name: "Response Time", free: "72hr", starter: "48hr", standard: "24hr", pro: "12hr", custom: "24hr" },
    ],
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-emerald-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-slate-300 mx-auto" />
    );
  }
  return <span className="text-sm text-slate-600">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden min-w-[800px]"
      >
        {/* Header */}
        <div className="grid grid-cols-6 bg-slate-50/50">
          <div className="p-6 text-left">
            <span className="text-sm font-semibold text-slate-900">Features</span>
          </div>
          <div className="p-6 text-center border-l border-slate-100 bg-emerald-50/50">
            <span className="text-sm font-semibold text-emerald-900">Free</span>
            <p className="text-xs text-emerald-600 mt-1">$0 forever</p>
          </div>
          <div className="p-6 text-center border-l border-slate-100">
            <span className="text-sm font-semibold text-slate-900">Starter</span>
            <p className="text-xs text-slate-500 mt-1">$29/sem</p>
          </div>
          <div className="p-6 text-center border-l border-slate-100 bg-indigo-50/50">
            <span className="text-sm font-semibold text-indigo-900">Standard</span>
            <p className="text-xs text-indigo-600 mt-1">$49/sem</p>
          </div>
          <div className="p-6 text-center border-l border-slate-100">
            <span className="text-sm font-semibold text-slate-900">Pro</span>
            <p className="text-xs text-slate-500 mt-1">$79/sem</p>
          </div>
          <div className="p-6 text-center border-l border-slate-100">
            <span className="text-sm font-semibold text-slate-900">Custom</span>
            <p className="text-xs text-slate-500 mt-1">Dynamic</p>
          </div>
        </div>

        {/* Body */}
        {features.map((section) => (
          <div key={section.category}>
            {/* Category Header */}
            <div className="grid grid-cols-6 bg-slate-50/30 border-t border-slate-100">
              <div className="col-span-6 p-4 px-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section.category}
                </span>
              </div>
            </div>

            {/* Items */}
            {section.items.map((item) => (
              <div key={item.name} className="grid grid-cols-6 border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                <div className="p-4 px-6">
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <div className="p-4 text-center border-l border-slate-100 bg-emerald-50/30">
                  <CellValue value={item.free} />
                </div>
                <div className="p-4 text-center border-l border-slate-100">
                  <CellValue value={item.starter} />
                </div>
                <div className="p-4 text-center border-l border-slate-100 bg-indigo-50/30">
                  <CellValue value={item.standard} />
                </div>
                <div className="p-4 text-center border-l border-slate-100">
                  <CellValue value={item.pro} />
                </div>
                <div className="p-4 text-center border-l border-slate-100">
                  <CellValue value={item.custom} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Price Row */}
        <div className="grid grid-cols-6 border-t-2 border-slate-200 bg-slate-50/50">
          <div className="p-6">
            <span className="text-sm font-semibold text-slate-900">Price</span>
          </div>
          <div className="p-6 text-center border-l border-slate-100 bg-emerald-50/50">
            <span className="text-lg font-bold text-emerald-900">Free</span>
            <span className="text-xs text-emerald-600"> forever</span>
          </div>
          <div className="p-6 text-center border-l border-slate-100">
            <span className="text-lg font-bold text-slate-900">$29</span>
            <span className="text-xs text-slate-500">/semester</span>
          </div>
          <div className="p-6 text-center border-l border-slate-100 bg-indigo-50/50">
            <span className="text-lg font-bold text-indigo-900">$49</span>
            <span className="text-xs text-indigo-600">/semester</span>
          </div>
          <div className="p-6 text-center border-l border-slate-100">
            <span className="text-lg font-bold text-slate-900">$79</span>
            <span className="text-xs text-slate-500">/semester</span>
          </div>
          <div className="p-6 text-center border-l border-slate-100">
            <span className="text-lg font-bold text-slate-900">Custom</span>
            <span className="text-xs text-slate-500">/semester</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
