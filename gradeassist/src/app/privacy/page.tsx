import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: January 15, 2026</p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p>
                  Welcome to Pointage. We respect your privacy and are committed to protecting your personal data.
                  This privacy policy will inform you about how we look after your personal data when you visit our
                  website and use our services, and tell you about your privacy rights and how the law protects you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <p className="mb-4">We collect and process the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Account Information:</strong> Name, email address, and authentication credentials
                  </li>
                  <li>
                    <strong className="text-white">Academic Content:</strong> Submissions, assignments, rubrics, and grading data that you upload
                  </li>
                  <li>
                    <strong className="text-white">Usage Data:</strong> Information about how you use our service, including features accessed and time spent
                  </li>
                  <li>
                    <strong className="text-white">Payment Information:</strong> Billing details and payment card information (processed securely through Stripe)
                  </li>
                  <li>
                    <strong className="text-white">Technical Data:</strong> IP address, browser type, device information, and cookies
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our AI-powered grading service</li>
                  <li>Process and analyze student submissions using artificial intelligence</li>
                  <li>Manage your account and subscription</li>
                  <li>Process payments and prevent fraud</li>
                  <li>Send you important updates about our service</li>
                  <li>Improve our AI models and service quality</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. AI Processing and Student Data</h2>
                <p className="mb-4">
                  When you upload student submissions to Pointage:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Submissions are processed by Google's Gemini AI to generate grades and feedback</li>
                  <li>We do not use student data to train our AI models without explicit consent</li>
                  <li>Student data is encrypted in transit and at rest</li>
                  <li>You retain full ownership of all uploaded content</li>
                  <li>We comply with FERPA (Family Educational Rights and Privacy Act) requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Third Parties</h2>
                <p className="mb-4">We share your data with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Google (Gemini AI):</strong> For AI-powered grading processing
                  </li>
                  <li>
                    <strong className="text-white">Stripe:</strong> For secure payment processing
                  </li>
                  <li>
                    <strong className="text-white">Supabase:</strong> For cloud storage of files
                  </li>
                  <li>
                    <strong className="text-white">Clerk:</strong> For authentication services
                  </li>
                </ul>
                <p className="mt-4">
                  We never sell your personal information to third parties. We only share data with service providers
                  who help us operate our platform, and they are contractually obligated to protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
                <p>
                  We retain your data for as long as your account is active or as needed to provide you services.
                  After account deletion, we will delete your personal data within 30 days, except where we are
                  required by law to retain certain information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@pointage.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against
                  unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls,
                  and regular security assessments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to improve your experience. See our{" "}
                  <Link href="/cookies" className="text-indigo-400 hover:text-indigo-300">
                    Cookie Policy
                  </Link>{" "}
                  for more details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate
                  safeguards are in place to protect your data in accordance with this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Children's Privacy</h2>
                <p>
                  Our service is not intended for children under 13. We do not knowingly collect personal information
                  from children under 13. However, student submissions graded through our platform may include work
                  from students of any age, which is handled in compliance with FERPA.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting
                  the new policy on this page and updating the "Last updated" date. We encourage you to review this
                  policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p>Email: privacy@pointage.com</p>
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
