import { useEffect, useState } from "react";
import { getDashboard } from "../../api/dashboard.api";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import { DashboardResponse, BranchComparison } from "../../types/dashboard";
import { useAuth } from "../../context/AuthContext";
import PaymentHealthCard from "../../components/dashboard/PaymentHealthCard";
import BookingStatusFunnel from "../../components/dashboard/BookingStatusFunnel";
import TopTestsTable from "../../components/dashboard/TopTestsTable";
import TechnicianPerformanceTable from "../../components/dashboard/TechnicianPerformanceTable";
import BranchComparisonTable from "../../components/dashboard/BranchComparisonTable";
import RightActionBar from "../../components/dashboard/RightActionBar";
import Overlay from "../../components/dashboard/Overlay";
import RightDrawer from "../../components/dashboard/RightDrawer";
import TechnicianRevenueDonut from "../../components/dashboard/TechnicianRevenueDonut";
import TopTestsRadialBar from "../../components/dashboard/TopTestsRadialBar";
import GrowthChart from "../../components/dashboard/GrowthChart";
import SummaryStatsCard from "../../components/dashboard/SummaryStatsCard";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/drawer.css";

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchComparison | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly"); // Default to monthly
  const [drawerOpen, setDrawerOpen] = useState(false)
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

    getDashboard(selectedBranch?.branch_id, selectedPeriod)
      .then((res) => {
        setDashboardData(res.data);
        console.log("Dashboard Data", res.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [isAuthorized, selectedBranch, selectedPeriod]);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | LMS - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for LMS - React.js Tailwind CSS Admin Dashboard Template"
      />

      {user?.role === "SUPER_ADMIN" && (
        <>
          <RightActionBar onOpen={() => setDrawerOpen(true)} />
          {drawerOpen && <Overlay onClick={() => setDrawerOpen(false)} />}
          <RightDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onSelectBranch={(branch) => setSelectedBranch(branch)}
          />
        </>
      )}

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
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
                <p className="text-sm opacity-90 mt-1">Business insights, revenue and performance overview</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Date Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="appearance-none bg-white/20 hover:bg-white/30 text-white py-2 pl-4 pr-8 rounded-lg text-sm font-medium border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer transition-colors"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  >
                    <option value="daily" className="text-gray-800">Has happened today</option>
                    <option value="weekly" className="text-gray-800">This Week</option>
                    <option value="monthly" className="text-gray-800">This Month</option>
                    <option value="all_time" className="text-gray-800">All Time</option>
                  </select>
                </div>

                {dashboardData && (
                  <>
                    <div className="h-8 w-px bg-white/20 hidden md:block mx-1"></div>
                    <div className="text-right">
                      <div className="text-xs text-white/80">Total Paid</div>
                      <div className="font-semibold text-lg">{formatCurrency(dashboardData.summary.total_paid)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/80">Net Revenue</div>
                      <div className="font-semibold text-lg">{formatCurrency(dashboardData.summary.net_revenue)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {selectedBranch && (
            <div className="col-span-12 flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Viewing Branch:</span>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                {selectedBranch.branch_name}
                <button onClick={() => setSelectedBranch(null)} className="hover:text-blue-800 dark:hover:text-blue-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}

          <div className="col-span-12">
            {dashboardData && (
              <EcommerceMetrics summary={dashboardData.summary} />
            )}
          </div>

          <div className="col-span-12 lg:col-span-8">
            {dashboardData && (
              <GrowthChart chartData={dashboardData.chart} />
            )}
          </div>

          {/* Put Payment Health in the previous Bookings & Revenue spot */}
          <div className="col-span-12 lg:col-span-4 h-100">
            {dashboardData && dashboardData.payment_health && (
              <PaymentHealthCard data={dashboardData.payment_health} />
            )}
          </div>

          {/* New row: Bookings & Revenue + Top Tests By Revenue side-by-side */}
          <div className="col-span-12 lg:col-span-6">
            {dashboardData && (
              <MonthlySalesChart chartData={dashboardData.chart} />
            )}
          </div>
          <div className="col-span-12 lg:col-span-6">
            {dashboardData && dashboardData.top_tests && (
              <TopTestsRadialBar data={dashboardData.top_tests} />
            )}
          </div>

          {/* Booking Status Funnel and Top Tests table side-by-side (kept) */}
          <div className="col-span-12 lg:col-span-6">
            {dashboardData && dashboardData.booking_funnel && (
              <BookingStatusFunnel data={dashboardData.booking_funnel} />
            )}
          </div>

          <div className="col-span-12 lg:col-span-6">
            {dashboardData && dashboardData.top_tests && (
              <TopTestsTable data={dashboardData.top_tests} />
            )}
          </div>

          {user?.role === "BRANCH_ADMIN" && (
            <div className="col-span-12 grid grid-cols-12 gap-4 md:gap-6">
              <div className="col-span-12 lg:col-span-8">
                {dashboardData && dashboardData.technician_performance && <TechnicianPerformanceTable data={dashboardData.technician_performance} />}
              </div>
              <div className="col-span-12 lg:col-span-4">
                {dashboardData && dashboardData.technician_performance && <TechnicianRevenueDonut data={dashboardData.technician_performance} />}
              </div>
            </div>
          )}

          {user?.role === "SUPER_ADMIN" && (
            <>
              <div className="col-span-12 lg:col-span-8">
                <BranchComparisonTable />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <DashboardCard title="Summary Stats" className="h-full">
                  {dashboardData && <SummaryStatsCard summary={dashboardData.summary} />}
                </DashboardCard>
              </div>
            </>
          )}

          {user?.role === "BRANCH_ADMIN" && (
            <div className="col-span-12 lg:col-span-4">
              <DashboardCard title="Summary Stats" className="h-full">
                {dashboardData && <SummaryStatsCard summary={dashboardData.summary} />}
              </DashboardCard>
            </div>
          )}

          <div className="col-span-12">
            {dashboardData && <RecentOrders bookings={dashboardData.recent_bookings} />}
          </div>
        </div>
      )}
    </>
  );
}
