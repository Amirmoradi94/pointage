import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: January 15, 2026</p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using Pointage ("Service"), you agree to be bound by these Terms of Service
                  ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p>
                  Pointage is an AI-powered grading assistant designed to help teaching assistants and instructors
                  grade student submissions efficiently. Our Service uses artificial intelligence (Google Gemini) to
                  analyze submissions and provide automated grading suggestions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Eligibility</h2>
                <p className="mb-4">You must meet the following requirements to use the Service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Be a teaching assistant, instructor, or educational professional</li>
                  <li>Have the authority to upload and grade student submissions</li>
                  <li>Comply with all applicable educational privacy laws (including FERPA)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. User Accounts</h2>
                <p className="mb-4">When you create an account with us, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms or are inactive for
                  extended periods.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription Plans and Billing</h2>
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.1 Plans</h3>
                <p>We offer the following subscription plans:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong className="text-white">Free Plan:</strong> 50 submissions per semester, 1 team member</li>
                  <li><strong className="text-white">Standard Plan:</strong> 1,500 submissions per semester, 1 team member, $8/month</li>
                  <li><strong className="text-white">Pro Plan:</strong> Unlimited submissions, up to 5 team members, $15/month</li>
                  <li><strong className="text-white">Custom Plans:</strong> Tailored to your specific needs</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.2 Billing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription fees are billed per semester (approximately 4 months)</li>
                  <li>All fees are in USD and exclude applicable taxes</li>
                  <li>Payment is processed through Stripe</li>
                  <li>Subscriptions auto-renew unless cancelled</li>
                  <li>You can upgrade, downgrade, or cancel your plan at any time</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.3 Usage Limits</h3>
                <p>
                  Each plan has submission limits per semester. If you exceed your limit, you will be prompted to
                  upgrade. We reserve the right to enforce these limits to ensure fair usage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Acceptable Use</h2>
                <p className="mb-4">You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload content that violates student privacy or educational privacy laws</li>
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Attempt to reverse engineer, decompile, or extract our AI models</li>
                  <li>Share your account credentials with unauthorized users</li>
                  <li>Upload malicious code, viruses, or harmful content</li>
                  <li>Abuse, harass, or harm other users or our staff</li>
                  <li>Scrape, crawl, or harvest data from the Service</li>
                  <li>Exceed rate limits or attempt to bypass usage restrictions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.1 Your Content</h3>
                <p>
                  You retain all ownership rights to the content you upload (submissions, rubrics, etc.). By uploading
                  content, you grant us a limited license to process, store, and display your content solely to
                  provide the Service.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.2 Our Content</h3>
                <p>
                  The Service, including its design, features, and AI models, is owned by Pointage and protected by
                  copyright, trademark, and other intellectual property laws. You may not copy, modify, or create
                  derivative works without our written permission.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.3 AI-Generated Content</h3>
                <p>
                  Grades and feedback generated by our AI are provided as suggestions. You remain responsible for
                  final grading decisions and must review all AI-generated content before using it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Educational Compliance</h2>
                <p className="mb-4">
                  You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You have proper authorization to upload and grade student submissions</li>
                  <li>You comply with FERPA and other applicable educational privacy laws</li>
                  <li>You will use AI-generated grades as suggestions, not final decisions</li>
                  <li>You will maintain academic integrity in your use of the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimers and Limitations</h2>
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.1 Service Availability</h3>
                <p>
                  The Service is provided "as is" and "as available." We do not guarantee uninterrupted access and may
                  suspend the Service for maintenance, updates, or unforeseen issues.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.2 AI Accuracy</h3>
                <p>
                  While our AI strives for accuracy, it may make errors. You are responsible for reviewing and
                  validating all AI-generated grades before finalizing them. We are not liable for grading errors or
                  academic disputes.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.3 Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, Pointage shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including lost profits, data, or goodwill, arising from
                  your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Data and Privacy</h2>
                <p>
                  Your use of the Service is also governed by our{" "}
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                  . By using the Service, you consent to the collection and use of your data as described in the
                  Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Cancellation and Termination</h2>
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">11.1 By You</h3>
                <p>
                  You may cancel your subscription at any time from your account settings. Cancellations take effect
                  at the end of your current billing period. See our{" "}
                  <Link href="/refunds" className="text-indigo-400 hover:text-indigo-300">
                    Refund Policy
                  </Link>{" "}
                  for refund eligibility.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">11.2 By Us</h3>
                <p>
                  We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity,
                  or for any other reason at our discretion. We will provide notice when possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to Terms</h2>
                <p>
                  We may modify these Terms at any time. We will notify you of significant changes via email or
                  through the Service. Your continued use after changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                  without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">14. Dispute Resolution</h2>
                <p>
                  Any disputes arising from these Terms or the Service shall be resolved through binding arbitration
                  in accordance with the rules of [Arbitration Organization], except where prohibited by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
                <p className="mb-4">
                  For questions about these Terms, please contact us at:
                </p>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p>Email: legal@pointage.com</p>
                  <p>Address: [Your Company Address]</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
