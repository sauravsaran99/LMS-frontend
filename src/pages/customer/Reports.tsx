import { useEffect, useState } from "react";
import { getCustomerBookings, getCustomerBookingReports } from "../../api/customer.api";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

interface Report {
  id: number;
  file_url: string;
  created_at: string;
  booking_id: number;
  booking_number?: string;
}

const CustomerReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const bookingsRes = await getCustomerBookings();
        const all: Report[] = [];

        for (const b of bookingsRes.data.data) {
          const r = await getCustomerBookingReports(b.id);
          const reportsWithBookingNumber = r.data.data.map((report: Report) => ({
            ...report,
            booking_number: b.booking_number,
          }));
          all.push(...reportsWithBookingNumber);
        }

        setReports(all);
      } catch (error) {
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

const downloadReport = (fileUrl: string, fileName?: string) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL; // http://localhost:5000

    const link = document.createElement("a");
    link.href = `${baseUrl}/${fileUrl}`;
    link.download = fileName || fileUrl.split("/").pop() || "report";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Report downloaded");
  } catch (error) {
    toast.error("Failed to download report");
  }
};


  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  return (
    <>
      <PageMeta title="Reports" description="Download your test reports" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Download and manage your test reports
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin dark:border-gray-700"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                No reports available
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Your test reports will appear here once they are ready.
              </p>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {!loading && reports.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report, idx) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-200 dark:bg-purple-900/40">
                          <svg
                            className="w-4 h-4 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Report #{idx + 1}
                        </h3>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 py-4 space-y-3">
                    {/* Booking ID */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Booking ID</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {report.booking_number}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0"
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
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Generated On</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {formatDate(report.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-800 px-5 py-3 bg-gray-50/50 dark:bg-gray-800/50">
                    <button
                      onClick={() =>
                        downloadReport(report.file_url, `report-${report.booking_number}`)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.03] px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {reports.length}
                </span>{" "}
                report{reports.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest: {reports.length > 0 && formatDate(reports[0].created_at)}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CustomerReports;
