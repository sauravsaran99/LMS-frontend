import { useState } from "react";
import { exportReportCSV, exportReportExcel, getReportSummary } from "../../api/report.api";
import toast from "react-hot-toast";
import Kpi from "../../components/Kpi";
import PageMeta from "../../components/common/PageMeta";

const ReportSummary = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [fromMonth, setFromMonth] = useState(new Date());
  const [toMonth, setToMonth] = useState(new Date());

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select date range");
      return;
    }

    try {
      setLoading(true);
      const res = await getReportSummary(fromDate, toDate);
      setData(res.data);
      toast.success("Report loaded successfully");
    } catch (err) {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Select date";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number, isFromDate: boolean) => {
    const month = isFromDate ? fromMonth : toMonth;
    const year = month.getFullYear();
    const monthNum = month.getMonth() + 1;
    const formattedDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (isFromDate) {
      setFromDate(formattedDate);
      setShowFromCalendar(false);
    } else {
      setToDate(formattedDate);
      setShowToCalendar(false);
    }
  };

  const renderCalendar = (month: Date, isFromDate: boolean) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const monthName = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const currentDateStr = isFromDate ? fromDate : toDate;
    const currentDay = currentDateStr ? new Date(currentDateStr).getDate() : null;
    const isCurrentMonth = currentDateStr ? new Date(currentDateStr).getMonth() === month.getMonth() && new Date(currentDateStr).getFullYear() === month.getFullYear() : false;

    return (
      <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-20">
        {/* Header with month/year and navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (isFromDate) {
                setFromMonth(new Date(month.getFullYear(), month.getMonth() - 1));
              } else {
                setToMonth(new Date(month.getFullYear(), month.getMonth() - 1));
              }
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{monthName}</h3>
          <button
            onClick={() => {
              if (isFromDate) {
                setFromMonth(new Date(month.getFullYear(), month.getMonth() + 1));
              } else {
                setToMonth(new Date(month.getFullYear(), month.getMonth() + 1));
              }
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleDateSelect(day, isFromDate)}
              disabled={!day}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                !day
                  ? "text-gray-200 dark:text-gray-700 cursor-default"
                  : isCurrentMonth && day === currentDay
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getMetricsData = () => {
    if (!data) return [];
    
    return [
      {
        title: "Tests Booked",
        value: data.total_bookings || 0,
        color: "blue",
        icon: "📋"
      },
      {
        title: "Tests Completed",
        value: data.completed_bookings || 0,
        color: "green",
        icon: "✓"
      },
      {
        title: "Gross Revenue",
        value: `₹${data.total_paid || 0}`,
        color: "purple",
        icon: "💰"
      },
      {
        title: "Discount Given",
        value: `₹${data.discount_given || 0}`,
        color: "orange",
        icon: "🏷️"
      },
      {
        title: "Net Revenue",
        value: `₹${data.discounted_revenue || 0}`,
        color: "cyan",
        icon: "📊"
      },
      {
        title: "Pending Payments",
        value: data.pending_payments || 0,
        color: "red",
        icon: "⏳"
      },
      {
        title: "Refunds",
        value: `₹${data.total_refunded || 0}`,
        color: "yellow",
        icon: "↩️"
      }
    ];
  };

  const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};


  return (
    <>
      <PageMeta title="Report Summary" description="View comprehensive report summary and analytics" />
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Report Summary
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            View comprehensive analytics and performance metrics
          </p>
        </div>

        {/* Filter Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Date Range
              </h2>
            </div>
            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (!fromDate || !toDate) {
                    toast.error("Please generate report first");
                    return;
                  }
                  const blob = await exportReportCSV(fromDate, toDate);
                  downloadFile(
                    blob,
                    `report_${fromDate}_to_${toDate}.csv`
                  );
                  toast.success("CSV exported successfully");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium transition-all active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!data}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19v-7m0 0V5m0 7H5m7 0h7" />
                </svg>
                <span>CSV</span>
              </button>
              <button
                onClick={async () => {
                  if (!fromDate || !toDate) {
                    toast.error("Please generate report first");
                    return;
                  }
                  const blob = await exportReportExcel(fromDate, toDate);
                  downloadFile(
                    blob,
                    `report_${fromDate}_to_${toDate}.xlsx`
                  );
                  toast.success("Excel exported successfully");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium transition-all active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!data}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19v-7m0 0V5m0 7H5m7 0h7" />
                </svg>
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* From Date Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <button
                onClick={() => setShowFromCalendar(!showFromCalendar)}
                className="w-full px-4 py-2.5 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all hover:border-blue-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{formatDateForDisplay(fromDate)}</span>
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>
              {showFromCalendar && (
                <div className="absolute top-full left-0 mt-2">
                  {renderCalendar(fromMonth, true)}
                </div>
              )}
            </div>

            {/* To Date Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <button
                onClick={() => setShowToCalendar(!showToCalendar)}
                className="w-full px-4 py-2.5 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all hover:border-blue-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{formatDateForDisplay(toDate)}</span>
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>
              {showToCalendar && (
                <div className="absolute top-full left-0 mt-2">
                  {renderCalendar(toMonth, false)}
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Generate Report</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {getMetricsData().map((metric, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {metric.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {metric.value}
                      </p>
                    </div>
                    <div className="text-3xl sm:text-4xl">{metric.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Stats Summary */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Financial Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    ₹{data.total_paid || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Discounts</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                    ₹{data.discount_given || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Net Revenue</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    ₹{data.discounted_revenue || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!data && !loading && (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02] p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
              No Report Generated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Select a date range and click "Generate Report" to view analytics
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportSummary;
