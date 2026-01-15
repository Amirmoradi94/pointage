"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Minus,
  Plus,
  Sparkles,
  Info,
  ArrowRight,
  FileText,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TEAM_MEMBER_PRICE = 5; // $5 per additional team member

export function PackageBuilder() {
  const [submissions, setSubmissions] = useState(500);
  const [teamMembers, setTeamMembers] = useState(1);
  const [animatedPrice, setAnimatedPrice] = useState(16);

  // Calculate price based on submissions and team members
  // Monthly price is calculated and rounded, then multiplied by 4 for semester price
  const calculatePrice = () => {
    const blocks = Math.ceil(submissions / 100);
    let monthlyPrice = 0;

    // Tiered monthly pricing: decreases per 100 submissions as volume increases
    if (blocks <= 5) {
      // 100-500: $0.80 per 100 per month
      monthlyPrice = blocks * 0.8;
    } else if (blocks <= 10) {
      // 501-1000: First 500 at $0.80, rest at $0.60
      monthlyPrice = (5 * 0.8) + ((blocks - 5) * 0.6);
    } else if (blocks <= 20) {
      // 1001-2000: Previous + $0.40 per 100
      monthlyPrice = (5 * 0.8) + (5 * 0.6) + ((blocks - 10) * 0.4);
    } else if (blocks <= 30) {
      // 2001-3000: Previous + $0.30 per 100
      monthlyPrice = (5 * 0.8) + (5 * 0.6) + (10 * 0.4) + ((blocks - 20) * 0.3);
    } else {
      // 3001-5000: Previous + $0.25 per 100
      monthlyPrice = (5 * 0.8) + (5 * 0.6) + (10 * 0.4) + (10 * 0.3) + ((blocks - 30) * 0.25);
    }

    // Add team member cost (first member is free)
    const teamCostMonthly = Math.max(0, teamMembers - 1) * (TEAM_MEMBER_PRICE / 4);

    // Round monthly price to whole number
    const totalMonthly = Math.round(monthlyPrice + teamCostMonthly);

    // Return semester price (monthly * 4)
    return totalMonthly * 4;
  };

  useEffect(() => {
    const newPrice = calculatePrice();

    // Animate price change
    const startPrice = animatedPrice;
    const endPrice = newPrice;
    const duration = 300;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(startPrice + (endPrice - startPrice) * progress);
      setAnimatedPrice(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [submissions, teamMembers]);

  return (
    <div className="dark-card rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Build Your Custom Plan</h3>
          <p className="text-sm text-gray-400">Pay only for what you need</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Submissions Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <Label className="text-sm font-medium text-gray-300">Submissions per Semester</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of submissions you can grade per semester</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg font-semibold text-white">{submissions.toLocaleString()}</span>
          </div>
          <Slider
            value={[submissions]}
            onValueChange={([val]) => setSubmissions(val)}
            min={100}
            max={5000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>100</span>
            <span>5,000</span>
          </div>
        </div>

        {/* Team Members Counter */}
        <div className="flex items-center justify-between py-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <Label className="text-sm font-medium text-gray-300">Team Members</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>First member free, +$5/member after</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setTeamMembers(Math.max(1, teamMembers - 1))}
              disabled={teamMembers <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-lg font-semibold text-white">
              {teamMembers}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setTeamMembers(Math.min(10, teamMembers + 1))}
              disabled={teamMembers >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-1">Your Price</p>
          <motion.div
            key={animatedPrice}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="flex items-baseline justify-center gap-1"
          >
            <span className="text-5xl font-bold text-white">
              ${Math.round(animatedPrice / 4)}
            </span>
            <span className="text-gray-400">/month</span>
          </motion.div>
          <p className="text-sm text-gray-500 mt-1">
            Billed per semester (${animatedPrice})
          </p>
        </div>

        {/* What's included */}
        <div className="mb-6 p-4 rounded-xl bg-gray-800/50">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">What&apos;s included:</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {submissions.toLocaleString()} submissions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {teamMembers} team member{teamMembers > 1 ? 's' : ''}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              AI-powered grading
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Rubric customization
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Export to CSV
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link href="/sign-up">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <p className="text-center text-xs text-gray-500 mt-4">
          No credit card required
        </p>
      </div>
    </div>
  );
}
