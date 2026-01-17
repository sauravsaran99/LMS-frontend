import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import CreatePaymentModal from "./CreatePaymentModal";
import { getBookingPayments } from "../../api/payment.api";
import RefundModal from "./RefundModal";

const Payments = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [openRefund, setOpenRefund] = useState(false);
const [refundBooking, setRefundBooking] = useState<any>(null);


  const load = async () => {
    try {
      setLoading(true);
      const res = await getBookingPayments();
      setBookings(res.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: string }> = {
      PAID: {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-700 dark:text-green-400",
        icon: "✓"
      },
      PENDING: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: "⏱"
      },
      PARTIALLY_PAID: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-400",
        icon: "⚬"
      },
      OVERDUE: {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        icon: "!"
      }
    };

    const badgeConfig = statusMap[status] || statusMap.PENDING;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${badgeConfig.bg} ${badgeConfig.text}`}>
        <span>{badgeConfig.icon}</span>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <>
      <PageMeta title="Payments" description="Booking-wise payment ledger" />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all booking payment records
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <svg
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
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
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading payments...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700">
                <svg
                  className="w-8 h-8 text-gray-500 dark:text-gray-400"
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
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Payments Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              There are no bookings with payment records yet.
            </p>
          </div>
        )}

        {/* Payments Table */}
        {!loading && bookings.length > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/50 dark:to-transparent">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Ledger
              </h2>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Paid
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings.map((b) => (
                    <tr
                      key={b.booking_number}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {b.booking_number.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {b.booking_number}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{Number(b.final_amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ₹{Number(b.total_paid - b.total_refunded).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${b.balance > 0 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}>
                          ₹{Number(b.balance).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(b.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {/* Add Payment */}
                          {b.balance > 0 && (
                            <button
                              onClick={() => {
                                setSelectedBooking(b.booking_number);
                                setOpenPayment(true);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-xs font-semibold text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Pay
                            </button>
                          )}

                          {/* Refund */}
                          {b.total_paid > b.total_refunded && (
                            <button
                              onClick={() => {
                                setRefundBooking(b);
                                setOpenRefund(true);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-xs font-semibold text-white transition-all hover:shadow-lg hover:from-red-700 hover:to-red-800 active:scale-95"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15V9m6 0v6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Refund
                            </button>
                          )}

                          {!b.balance && b.total_paid <= b.total_refunded && (
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                              No actions
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{bookings.length}</span> booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {openPayment && selectedBooking && (
        <CreatePaymentModal
          bookingNumber={selectedBooking}
          onClose={() => {
            setOpenPayment(false);
            setSelectedBooking(null);
            load();
          }}
        />
      )}

      {openRefund && refundBooking && (
  <RefundModal
    bookingNumber={refundBooking.booking_number}
    refundableAmount={
      refundBooking.total_paid - refundBooking.total_refunded
    }
    onClose={() => {
      setOpenRefund(false);
      setRefundBooking(null);
    }}
    onSuccess={load}
  />
)}

    </>
  );
};

export default Payments;
