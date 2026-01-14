// Pricing calculation logic for Pointage

export interface PricingConfig {
  courses: number;
  studentsPerCourse: number;
  assignmentsPerCourse: number;
  teamMembers: number;
  prioritySupport: boolean;
}

export interface PricingResult {
  basePrice: number;
  coursesAddon: number;
  studentsAddon: number;
  assignmentsAddon: number;
  teamAddon: number;
  featuresAddon: number;
  totalPrice: number;
  monthlyPrice: number;
  savings: number;
  recommendedPlan: string | null;
}

// Base pricing constants
export const PRICING = {
  BASE_PRICE: 29, // Base price per semester
  COURSE_ADDON: 15, // Per additional course after 1st
  STUDENT_ADDON: 0.20, // Per student after 50
  ASSIGNMENT_ADDON: 1, // Per assignment after 10
  TEAM_ADDON: 10, // Per team member after 1st
  PRIORITY_SUPPORT: 10,
  
  // Thresholds
  FREE_STUDENTS: 50,
  FREE_ASSIGNMENTS: 10,
};

// Preset plans for comparison
export const PRESET_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    courses: 1,
    students: 30,
    assignments: 8,
    teamMembers: 1,
    features: [],
  },
  {
    id: "standard",
    name: "Standard",
    price: 49,
    courses: 1,
    students: 100,
    assignments: 15,
    teamMembers: 1,
    features: ["prioritySupport"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    courses: 3,
    students: 999, // "Unlimited" represented as high number
    assignments: 999,
    teamMembers: 3,
    features: ["prioritySupport"],
  },
];

export function calculatePrice(config: PricingConfig): PricingResult {
  const {
    courses,
    studentsPerCourse,
    assignmentsPerCourse,
    teamMembers,
    prioritySupport,
  } = config;

  // Calculate addons
  const coursesAddon = Math.max(0, courses - 1) * PRICING.COURSE_ADDON;
  const studentsAddon = Math.max(0, studentsPerCourse - PRICING.FREE_STUDENTS) * PRICING.STUDENT_ADDON;
  const assignmentsAddon = Math.max(0, assignmentsPerCourse - PRICING.FREE_ASSIGNMENTS) * PRICING.ASSIGNMENT_ADDON;
  const teamAddon = Math.max(0, teamMembers - 1) * PRICING.TEAM_ADDON;
  
  const featuresAddon = prioritySupport ? PRICING.PRIORITY_SUPPORT : 0;

  const totalPrice = Math.round(
    PRICING.BASE_PRICE + coursesAddon + studentsAddon + assignmentsAddon + teamAddon + featuresAddon
  );

  const monthlyPrice = Math.round(totalPrice / 4 * 100) / 100;

  // Find recommended preset plan
  const recommendedPlan = findRecommendedPlan(config, totalPrice);
  
  // Calculate savings vs hourly rate
  // Assume: 50 students, 10 assignments, 15 min each manual = 125 hours
  // With AI: 70% time saved = 87.5 hours saved
  // At $15/hr = $1,312 saved
  const estimatedHoursSaved = Math.round(
    (studentsPerCourse * assignmentsPerCourse * 0.25 * 0.7) // 15 min per submission, 70% saved
  );
  const savings = estimatedHoursSaved * 15; // $15/hour estimate

  return {
    basePrice: PRICING.BASE_PRICE,
    coursesAddon,
    studentsAddon: Math.round(studentsAddon * 100) / 100,
    assignmentsAddon,
    teamAddon,
    featuresAddon,
    totalPrice,
    monthlyPrice,
    savings,
    recommendedPlan,
  };
}

function findRecommendedPlan(config: PricingConfig, customPrice: number): string | null {
  // Check if a preset plan covers the user's needs at a better price
  for (const plan of PRESET_PLANS) {
    const coversNeeds = 
      plan.courses >= config.courses &&
      plan.students >= config.studentsPerCourse &&
      plan.assignments >= config.assignmentsPerCourse &&
      plan.teamMembers >= config.teamMembers;

    const coverFeatures = 
      !config.prioritySupport || plan.features.includes("prioritySupport");

    if (coversNeeds && coverFeatures && plan.price <= customPrice + 10) {
      return plan.name;
    }
  }
  return null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
