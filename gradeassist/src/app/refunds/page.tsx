import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: January 15, 2026</p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Overview</h2>
                <p>
                  At Pointage, we want you to be completely satisfied with our service. This Refund Policy explains
                  our policy regarding refunds and cancellations for our subscription plans.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. 30-Day Money-Back Guarantee</h2>
                <p className="mb-4">
                  We offer a <strong className="text-white">30-day money-back guarantee</strong> for all paid
                  subscription plans (Standard, Pro, and Custom).
                </p>

                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg my-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">Eligibility Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Your first payment for a new subscription</li>
                    <li>Request made within 30 days of your initial payment</li>
                    <li>Account has not been previously refunded</li>
                    <li>No violation of our Terms of Service</li>
                  </ul>
                </div>

                <p>
                  If you're not satisfied with Pointage within the first 30 days, simply contact us and we'll issue
                  a full refund - no questions asked.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Free Plan</h2>
                <p>
                  The Free plan requires no payment and therefore is not eligible for refunds. You can use the Free
                  plan indefinitely with no financial commitment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Refunds After 30 Days</h2>
                <p className="mb-4">
                  After the 30-day guarantee period, refunds are handled on a case-by-case basis and may be issued
                  in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Service Outages:</strong> Extended downtime preventing you from
                    using the service
                  </li>
                  <li>
                    <strong className="text-white">Billing Errors:</strong> Duplicate charges or incorrect billing
                    amounts
                  </li>
                  <li>
                    <strong className="text-white">Technical Issues:</strong> Critical bugs that prevent core
                    functionality, unresolved by our support team
                  </li>
                  <li>
                    <strong className="text-white">Extenuating Circumstances:</strong> At our discretion, based on
                    individual situations
                  </li>
                </ul>
                <p className="mt-4">
                  These refunds are prorated based on the unused portion of your subscription period.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription Cancellations</h2>
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.1 How to Cancel</h3>
                <p className="mb-4">You can cancel your subscription at any time by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Going to Settings → Subscription in your dashboard</li>
                  <li>Clicking "Cancel Subscription"</li>
                  <li>Confirming your cancellation</li>
                </ul>
                <p className="mt-4">
                  Alternatively, you can contact our support team at support@pointage.com to cancel.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">5.2 What Happens After Cancellation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You will continue to have access until the end of your current billing period</li>
                  <li>You will not be charged again after your current period ends</li>
                  <li>Your data will be retained for 30 days after cancellation</li>
                  <li>After 30 days, your account will be downgraded to the Free plan</li>
                  <li>You can reactivate your subscription at any time before the 30-day period</li>
                </ul>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg my-4">
                  <p className="text-sm">
                    <strong className="text-yellow-400">Important:</strong> Canceling your subscription does not
                    automatically qualify you for a refund. Refunds are only available within the 30-day guarantee
                    period or under the circumstances outlined in Section 4.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Plan Upgrades and Downgrades</h2>
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.1 Upgrades</h3>
                <p>
                  When you upgrade to a higher plan, you will be charged the prorated difference immediately, and
                  your new plan takes effect right away.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.2 Downgrades</h3>
                <p className="mb-4">
                  When you downgrade to a lower plan:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The change takes effect at the end of your current billing period</li>
                  <li>You continue to have access to your current plan's features until then</li>
                  <li>No refund is issued for the unused portion of the higher plan</li>
                  <li>You'll be charged the lower rate on your next billing date</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Non-Refundable Situations</h2>
                <p className="mb-4">Refunds will not be issued in the following cases:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Change of mind after the 30-day guarantee period</li>
                  <li>Failure to cancel before the next billing cycle</li>
                  <li>Account termination due to Terms of Service violations</li>
                  <li>Unused submission credits or team member slots</li>
                  <li>Custom plan setup fees or onboarding costs (if applicable)</li>
                  <li>Previously issued refunds on the same account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. How to Request a Refund</h2>
                <p className="mb-4">To request a refund, please:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Email us at refunds@pointage.com</li>
                  <li>Include your account email and reason for the refund request</li>
                  <li>Provide your order number or payment confirmation (if available)</li>
                </ol>

                <div className="bg-gray-900 p-4 rounded-lg mt-4">
                  <p className="font-semibold mb-2">Refund Contact Information:</p>
                  <p>Email: refunds@pointage.com</p>
                  <p>Support: support@pointage.com</p>
                  <p className="mt-2 text-sm text-gray-400">
                    We typically respond to refund requests within 2-3 business days.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Refund Processing</h2>
                <p className="mb-4">Once approved, refunds will be processed as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds are issued to the original payment method</li>
                  <li>Processing time: 5-10 business days depending on your bank</li>
                  <li>You will receive a confirmation email once the refund is processed</li>
                  <li>Your account will be downgraded to the Free plan immediately</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Billing Disputes</h2>
                <p className="mb-4">
                  If you notice an unexpected charge or billing error:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact us immediately at billing@pointage.com</li>
                  <li>Do not initiate a chargeback before contacting us</li>
                  <li>We will investigate and resolve the issue within 5 business days</li>
                  <li>If an error occurred on our end, we'll issue a full refund</li>
                </ol>

                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg my-4">
                  <p className="text-sm">
                    <strong className="text-red-400">Chargebacks:</strong> Initiating a chargeback without
                    contacting us may result in immediate account suspension. Please reach out to us first - we're
                    happy to resolve any billing issues.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Academic Institution Arrangements</h2>
                <p>
                  Academic institutions with custom contracts may have different refund terms. Please refer to your
                  signed agreement or contact your account manager for details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
                <p>
                  We may update this Refund Policy from time to time. Changes will be posted on this page with an
                  updated "Last updated" date. Continued use of the service after changes constitutes acceptance of
                  the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Questions</h2>
                <p className="mb-4">
                  If you have any questions about our Refund Policy, please contact us:
                </p>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p>Email: support@pointage.com</p>
                  <p>Billing: billing@pointage.com</p>
                  <p>Refunds: refunds@pointage.com</p>
                </div>
              </section>

              <div className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold text-white mb-3">Our Commitment to You</h3>
                <p>
                  We believe in our product and want you to love using Pointage. If you're not satisfied, we'll make
                  it right. Our 30-day money-back guarantee ensures you can try our service risk-free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
