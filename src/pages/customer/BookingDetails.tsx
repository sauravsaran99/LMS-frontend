import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerBookingTests, getCustomerBookingReports } from "../../api/customer.api";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const testsRes = await getCustomerBookingTests(Number(id));
        const reportsRes = await getCustomerBookingReports(Number(id));
        setTests(testsRes.data.data);
        setReports(reportsRes.data.data);
      } catch (error) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  return (
    <>
      <PageMeta title="Booking Details" description="View your booking details and reports" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking Details</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View tests and reports for this booking
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin dark:border-gray-700"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading details...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tests Section */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tests</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tests.length} test(s) included
                  </p>
                </div>
              </div>

              <div className="p-6">
                {tests.length > 0 ? (
                  <div className="space-y-3">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40">
                            <svg
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {test.Test?.name}
                            </p>
                            {test.Test?.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {test.Test.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No tests included in this booking
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reports Section */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reports</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reports.length} report(s) available
                  </p>
                </div>
              </div>

              <div className="p-6">
                {reports.length > 0 ? (
                  <div className="space-y-3">
                    {reports.map((report, idx) => (
                      <button
                        key={report.id}
                        onClick={() => downloadReport(report.file_url, `report-${idx + 1}`)}
                        className="w-full flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 group-hover:scale-110 transition-transform">
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
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Test Report {idx + 1}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Click to download
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform"
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
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
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
                    <p className="text-gray-500 dark:text-gray-400">No reports available yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BookingDetails;
