import { useEffect, useState } from "react";
import { getDashboard } from "../../api/dashboard.api";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import { DashboardResponse } from "../../types/dashboard";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const auth = useAuth();
  const user = auth?.user;

  const isAuthorized = user?.role === "SUPER_ADMIN" || user?.role === "BRANCH_ADMIN";

  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  useEffect(() => {
    if (!isAuthorized) return;

    getDashboard()
      .then((res) => {
        setDashboardData(res.data);
        console.log("Dashboard Data", res.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [isAuthorized]);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | LMS - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for LMS - React.js Tailwind CSS Admin Dashboard Template"
      />

      {!isAuthorized ? (
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 blur-md opacity-50 pointer-events-none">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              <div className="col-span-12 h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            </div>
          </div>
          <div className="relative z-10 text-center">
            <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0V7m0 8v2m0 4v2m0-10H7m5 0h5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5.5A2.5 2.5 0 0 0 9.5 8m5 0A2.5 2.5 0 0 1 12 5.5m0 0A2.5 2.5 0 0 0 9.5 8m5 0A2.5 2.5 0 0 1 12 5.5m0 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You are not authorized to access this dashboard.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Only ADMIN and BRANCH_ADMIN users can view this page.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            {dashboardData && <EcommerceMetrics summary={dashboardData.summary} />}
          </div>

          <div className="col-span-12 lg:col-span-8">
            {dashboardData && <MonthlySalesChart chartData={dashboardData.chart} />}
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Summary Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Total Paid</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">
                    {dashboardData && formatCurrency(dashboardData.summary.total_paid)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Discount Given</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">
                    {dashboardData && formatCurrency(dashboardData.summary.discount_given)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Net Revenue</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">
                    {dashboardData && formatCurrency(dashboardData.summary.net_revenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Pending Payments</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {dashboardData && dashboardData.summary.pending_payments}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            {dashboardData && <RecentOrders bookings={dashboardData.recent_bookings} />}
          </div>
        </div>
      )}
    </>
  );
}
