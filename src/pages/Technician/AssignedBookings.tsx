import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import { collectSample } from "../../api/technician.api";
import CompleteBookingPopup from "../../components/CompleteBookingPopup";

const AssignedBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupState, setPopupState] = useState({
    isOpen: false,
    bookingId: 0,
    booking: null as any,
    bookingNumber: "",
    customerName: "",
    pendingAmount: 0,
  });

  const loadBookings = async () => {
    try {
      const res = await api.get("/technician/bookings");
      setBookings(res.data);
    } catch {
      toast.error("Failed to load assigned bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCollectSample = async (bookingId: number) => {
    try {
      await collectSample(bookingId);
      toast.success("Sample collected");
      loadBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

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

  const handleComplete = async (bookingId: number, booking: any) => {
    // Open popup instead of directly calling API
    setPopupState({
      isOpen: true,
      bookingId,
      booking,
      bookingNumber: booking.booking_number || "",
      customerName: booking.Customer?.name || "",
      pendingAmount: booking.pending_amount || 0,
    });
  };

  const handleClosePopup = () => {
    setPopupState({
      isOpen: false,
      bookingId: 0,
      booking: null,
      bookingNumber: "",
      customerName: "",
      pendingAmount: 0,
    });
  };

  const handlePopupSuccess = () => {
    loadBookings();
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

  const formatTime = (time: string) => {
    if (!time) return "-";
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  return (
    <>
      <PageMeta title="My Assigned Bookings" description="View your assigned bookings" />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Assigned Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage all your assigned customer bookings
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
            <svg
              className="w-6 h-6 text-white"
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
                No assigned bookings yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                You don't have any bookings assigned to you at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && bookings.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.03]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {booking.booking_number || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {booking.Customer?.name?.charAt(0).toUpperCase() || "C"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {booking.Customer?.name || "-"}
                            </p>
                            {booking.Customer?.phone && (
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {booking.Customer.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(booking.scheduled_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatTime(booking.scheduled_time)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.status === "TECH_ASSIGNED" && (
                          <button
                            onClick={() => handleCollectSample(booking.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            Collect Sample
                          </button>
                        )}

                        {booking.status === "SAMPLE_COLLECTED" && (
                          <button
                            onClick={() => handleComplete(booking.id, booking)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Mark Completed
                          </button>
                        )}

                        {booking.status === "COMPLETED" && (
                          <span className="text-gray-500">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.03] px-6 py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{bookings.length}</span> booking
                {bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      <CompleteBookingPopup
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        bookingId={popupState.bookingId}
        booking={popupState.booking}
        bookingNumber={popupState.bookingNumber}
        customerName={popupState.customerName}
        pendingAmount={popupState.pendingAmount}
        onSuccess={handlePopupSuccess}
      />
    </>
  );
};

export default AssignedBookings;
