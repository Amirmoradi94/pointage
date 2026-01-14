"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Minus, 
  Plus, 
  Sparkles, 
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  calculatePrice, 
  formatCurrency,
  PricingConfig,
  PricingResult,
  PRICING 
} from "@/lib/pricing";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PackageBuilder() {
  const [config, setConfig] = useState<PricingConfig>({
    courses: 1,
    studentsPerCourse: 50,
    assignmentsPerCourse: 10,
    teamMembers: 1,
    prioritySupport: false,
  });

  const [result, setResult] = useState<PricingResult | null>(null);
  const [animatedPrice, setAnimatedPrice] = useState(29);

  useEffect(() => {
    const newResult = calculatePrice(config);
    setResult(newResult);
    
    // Animate price change
    const startPrice = animatedPrice;
    const endPrice = newResult.totalPrice;
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
  }, [config]);

  const updateConfig = (key: keyof PricingConfig, value: number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Build Your Custom Plan</h3>
          <p className="text-sm text-slate-500">Adjust settings to match your needs</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Courses Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-700">Number of Courses</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First course included in base price</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg font-semibold text-slate-900">{config.courses}</span>
          </div>
          <Slider
            value={[config.courses]}
            onValueChange={([val]) => updateConfig("courses", val)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1 course</span>
            <span>10 courses</span>
          </div>
        </div>

        {/* Students Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-700">Students per Course</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First 50 students included free</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg font-semibold text-slate-900">{config.studentsPerCourse}</span>
          </div>
          <Slider
            value={[config.studentsPerCourse]}
            onValueChange={([val]) => updateConfig("studentsPerCourse", val)}
            min={10}
            max={500}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>10 students</span>
            <span>500 students</span>
          </div>
        </div>

        {/* Assignments Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-700">Assignments per Course</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First 10 assignments included free</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg font-semibold text-slate-900">{config.assignmentsPerCourse}</span>
          </div>
          <Slider
            value={[config.assignmentsPerCourse]}
            onValueChange={([val]) => updateConfig("assignmentsPerCourse", val)}
            min={5}
            max={30}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>5 assignments</span>
            <span>30 assignments</span>
          </div>
        </div>

        {/* Team Members Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-slate-700">Team Members</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add TAs who can grade and review</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateConfig("teamMembers", Math.max(1, config.teamMembers - 1))}
              disabled={config.teamMembers <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-lg font-semibold text-slate-900">
              {config.teamMembers}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateConfig("teamMembers", Math.min(10, config.teamMembers + 1))}
              disabled={config.teamMembers >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-4">Add-ons</p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm text-slate-700">Priority Support</Label>
              <p className="text-xs text-slate-400">24hr response time</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">+{formatCurrency(PRICING.PRIORITY_SUPPORT)}</span>
              <Switch
                checked={config.prioritySupport}
                onCheckedChange={(val) => updateConfig("prioritySupport", val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 mb-1">Your Price</p>
          <motion.div
            key={animatedPrice}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="flex items-baseline justify-center gap-1"
          >
            <span className="text-5xl font-bold text-slate-900">
              ${animatedPrice}
            </span>
            <span className="text-slate-500">/semester</span>
          </motion.div>
          <p className="text-sm text-slate-400 mt-1">
            ~${result?.monthlyPrice ?? Math.round(animatedPrice / 4)}/month
          </p>
        </div>

        {/* Savings */}
        {result && result.savings > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-emerald-50">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-700">
              Estimated {formatCurrency(result.savings)} in time saved this semester
            </span>
          </div>
        )}

        {/* Recommendation */}
        <AnimatePresence mode="wait">
          {result?.recommendedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100"
            >
              <p className="text-sm text-indigo-700">
                <span className="font-medium">Tip:</span> The {result.recommendedPlan} plan includes 
                similar features and might be a better fit for your needs.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <Link href="/sign-up">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25">
            Get Started with Custom Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <p className="text-center text-xs text-slate-400 mt-4">
          No credit card required • 14-day free trial
        </p>
      </div>
    </div>
  );
}
