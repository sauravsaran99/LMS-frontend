import { Link } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="flex-1 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-100 dark:bg-brand-950 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-light-100 dark:bg-blue-light-950 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-4 py-2 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-full text-sm font-semibold">
                  ✨ Laboratory Management System
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Streamline Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600">
                    Laboratory Management
                  </span>
                </h1>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                Efficiently manage bookings, handle payments, and track reports all in one intuitive
                platform designed for modern laboratories.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/signup"
                  className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/30 dark:from-brand-600 dark:to-brand-800 transition-all duration-300 text-center"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/signin"
                  className="px-8 py-3.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-2xl font-bold text-brand-500 dark:text-brand-400">100%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Uptime Guarantee</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-500 dark:text-brand-400">24/7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Support Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-500 dark:text-brand-400">50K+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-brand-50 to-blue-light-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                {/* Placeholder for Hero Image */}
                <div className="aspect-square bg-gradient-to-br from-brand-200 to-blue-light-200 dark:from-brand-900 dark:to-blue-light-900 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-brand-400 dark:text-brand-600 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your laboratory efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-brand-600 dark:text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Easy Booking Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule and manage laboratory bookings with an intuitive calendar interface and
                real-time availability tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-50 dark:from-success-900 dark:to-success-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-success-600 dark:text-success-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Payment Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure payment handling with multiple payment methods, automated invoicing, and
                detailed transaction history.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-light-100 to-blue-light-50 dark:from-blue-light-900 dark:to-blue-light-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-light-600 dark:text-blue-light-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Comprehensive Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate detailed analytics and reports with customizable filters and export options
                for better insights.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                User Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage multiple user roles including doctors, technicians, and administrators with
                granular permissions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-brand-600 dark:text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise-grade security with data encryption, regular backups, and compliance with
                healthcare standards.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-gray-300/50 dark:hover:shadow-gray-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-50 dark:from-success-900 dark:to-success-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-success-600 dark:text-success-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with instant notifications for bookings, payments, and important system
                events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Our LMS?
              </h2>

              <div className="space-y-6">
                {/* Benefit 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900">
                      <svg
                        className="h-6 w-6 text-brand-600 dark:text-brand-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Increased Efficiency
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Automate routine tasks and reduce manual workload by up to 70%.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900">
                      <svg
                        className="h-6 w-6 text-brand-600 dark:text-brand-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Cost Reduction
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Lower operational costs through automation and optimized resource management.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900">
                      <svg
                        className="h-6 w-6 text-brand-600 dark:text-brand-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Better Customer Experience
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Provide seamless booking and payment experience to your customers.
                    </p>
                  </div>
                </div>

                {/* Benefit 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900">
                      <svg
                        className="h-6 w-6 text-brand-600 dark:text-brand-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Data-Driven Insights
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Make informed decisions with comprehensive analytics and reporting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-brand-50 to-blue-light-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                <div className="aspect-square bg-gradient-to-br from-brand-200 to-blue-light-200 dark:from-brand-900 dark:to-blue-light-900 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-brand-400 dark:text-brand-600 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Laboratory?
          </h2>
          <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of laboratories already using our platform to streamline their operations
            and improve customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-lg bg-white text-brand-600 font-semibold hover:shadow-lg transition-shadow text-center"
            >
              Start Free Trial
            </Link>
            <Link
              to="/signin"
              className="px-8 py-3.5 rounded-lg border border-white text-white font-semibold hover:bg-white/10 transition-colors text-center"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default LandingPage;
