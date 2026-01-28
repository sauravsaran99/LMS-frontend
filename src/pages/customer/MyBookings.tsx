import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerBookings } from "../../api/customer.api";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCustomerBookings();
        setBookings(res.data.data);
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadgeClasses = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    const baseClasses = "px-3 py-1.5 text-xs font-semibold rounded-full";

    if (statusLower === "pending") {
      return `${baseClasses} bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400`;
    } else if (statusLower === "confirmed") {
      return `${baseClasses} bg-blue-light-100 text-blue-light-700 dark:bg-blue-light-900/30 dark:text-blue-light-400`;
    } else if (statusLower === "completed") {
      return `${baseClasses} bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400`;
    } else if (statusLower === "cancelled") {
      return `${baseClasses} bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`;
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <>
      <PageMeta title="My Bookings" description="View all your bookings" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all your test bookings
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin dark:border-gray-700"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Loading your bookings...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                No bookings yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                You don't have any bookings at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && bookings.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Booking ID
                      </p>
                      <span className={getStatusBadgeClasses(booking.status)}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {booking.booking_number}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 py-4 space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled Date</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatDate(booking.scheduled_date)}
                        </p>
                      </div>
                    </div>

                    {/* Test Count */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tests</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {booking.tests_count || 0} test
                          {booking.tests_count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-800 px-5 py-3 bg-gray-50/50 dark:bg-gray-800/50">
                    <button
                      onClick={() => navigate(`/customer/bookings/${booking.id}`)}
                      className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>View Details</span>
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
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
                  {bookings.length}
                </span>{" "}
                booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyBookings;
