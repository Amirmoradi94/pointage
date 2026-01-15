import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: January 15, 2026</p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. They help us
                  provide you with a better experience by remembering your preferences, keeping you logged in, and
                  analyzing how you use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
                <p className="mb-4">Pointage uses cookies for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Authentication:</strong> Keep you logged in to your account
                  </li>
                  <li>
                    <strong className="text-white">Security:</strong> Protect against unauthorized access and fraud
                  </li>
                  <li>
                    <strong className="text-white">Preferences:</strong> Remember your settings and customizations
                  </li>
                  <li>
                    <strong className="text-white">Analytics:</strong> Understand how users interact with our service
                  </li>
                  <li>
                    <strong className="text-white">Performance:</strong> Improve loading times and user experience
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>

                <div className="space-y-6 mt-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                    <p className="text-sm mb-2">These cookies are necessary for the website to function properly.</p>
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-2 text-gray-400">Cookie</th>
                          <th className="text-left py-2 text-gray-400">Purpose</th>
                          <th className="text-left py-2 text-gray-400">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <td className="py-2">__session</td>
                          <td className="py-2">Authentication and session management</td>
                          <td className="py-2">Session</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="py-2">clerk_*</td>
                          <td className="py-2">User authentication via Clerk</td>
                          <td className="py-2">1 year</td>
                        </tr>
                        <tr>
                          <td className="py-2">csrf_token</td>
                          <td className="py-2">Security and CSRF protection</td>
                          <td className="py-2">Session</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                    <p className="text-sm mb-2">These cookies enable enhanced functionality and personalization.</p>
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-2 text-gray-400">Cookie</th>
                          <th className="text-left py-2 text-gray-400">Purpose</th>
                          <th className="text-left py-2 text-gray-400">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <td className="py-2">user_preferences</td>
                          <td className="py-2">Store user settings and preferences</td>
                          <td className="py-2">1 year</td>
                        </tr>
                        <tr>
                          <td className="py-2">theme</td>
                          <td className="py-2">Remember dark/light mode preference</td>
                          <td className="py-2">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                    <p className="text-sm mb-2">These cookies help us understand how visitors use our website.</p>
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-2 text-gray-400">Cookie</th>
                          <th className="text-left py-2 text-gray-400">Purpose</th>
                          <th className="text-left py-2 text-gray-400">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <td className="py-2">_ga</td>
                          <td className="py-2">Google Analytics - distinguish users</td>
                          <td className="py-2">2 years</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="py-2">_gid</td>
                          <td className="py-2">Google Analytics - distinguish users</td>
                          <td className="py-2">24 hours</td>
                        </tr>
                        <tr>
                          <td className="py-2">_gat</td>
                          <td className="py-2">Google Analytics - throttle request rate</td>
                          <td className="py-2">1 minute</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Payment Cookies</h3>
                    <p className="text-sm mb-2">These cookies are used to process payments securely.</p>
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-2 text-gray-400">Cookie</th>
                          <th className="text-left py-2 text-gray-400">Purpose</th>
                          <th className="text-left py-2 text-gray-400">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2">stripe_*</td>
                          <td className="py-2">Stripe payment processing and fraud prevention</td>
                          <td className="py-2">Session</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
                <p className="mb-4">We use third-party services that may set their own cookies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Google Analytics:</strong> For website analytics and usage patterns
                  </li>
                  <li>
                    <strong className="text-white">Stripe:</strong> For secure payment processing
                  </li>
                  <li>
                    <strong className="text-white">Clerk:</strong> For authentication services
                  </li>
                  <li>
                    <strong className="text-white">Supabase:</strong> For cloud storage services
                  </li>
                </ul>
                <p className="mt-4">
                  These third parties have their own privacy policies and cookie policies. We recommend reviewing
                  them to understand how they use cookies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Managing Cookies</h2>
                <p className="mb-4">
                  You have the right to decide whether to accept or reject cookies. You can manage your cookie
                  preferences through:
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">Browser Settings</h3>
                <p className="mb-2">Most browsers allow you to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View cookies stored on your device</li>
                  <li>Delete cookies individually or all at once</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all third-party cookies</li>
                  <li>Clear all cookies when you close your browser</li>
                </ul>

                <div className="bg-gray-900 p-4 rounded-lg mt-4">
                  <p className="font-semibold mb-2">Browser-specific instructions:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>• Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                    <li>• Safari: Preferences → Privacy → Manage Website Data</li>
                    <li>• Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>

                <p className="mt-4 text-yellow-400 text-sm">
                  <strong>Note:</strong> Blocking essential cookies may prevent you from using certain features of our
                  service, including logging in and accessing your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Do Not Track</h2>
                <p>
                  Some browsers have a "Do Not Track" feature that signals to websites that you do not want to be
                  tracked. Currently, there is no industry standard for how to respond to Do Not Track signals. Our
                  website does not currently respond to Do Not Track signals.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Cookie Duration</h2>
                <p className="mb-4">Cookies can be either:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Session cookies:</strong> Temporary cookies that expire when you
                    close your browser
                  </li>
                  <li>
                    <strong className="text-white">Persistent cookies:</strong> Cookies that remain on your device
                    until they expire or you delete them
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons. Please check this page periodically for updates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. More Information</h2>
                <p className="mb-4">
                  For more information about how we handle your data, please see our{" "}
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p>
                  If you have questions about our use of cookies, please contact us at:
                </p>
                <div className="bg-gray-900 p-4 rounded-lg mt-4">
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
