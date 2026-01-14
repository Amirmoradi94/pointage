import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  
  // If user is signed in, redirect them to dashboard
  // This prevents signed-in users from seeing the landing page
  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingPreview />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
