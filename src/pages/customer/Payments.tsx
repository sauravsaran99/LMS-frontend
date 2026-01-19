import { useEffect, useState } from "react";
import { getCustomerBookings, getCustomerBookingPayments } from "../../api/customer.api";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

interface Payment {
  id: number;
  booking_number: string;
  amount: number;
  payment_date: string;
  payment_mode: string;
  status: string;
}

const CustomerPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const bookingsRes = await getCustomerBookings();
        const allPayments: Payment[] = [];

        for (const b of bookingsRes.data) {
          const p = await getCustomerBookingPayments(b.booking_number);
          allPayments.push(...p.data);
        }

        setPayments(allPayments);
      } catch (error) {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getPaymentModeBadge = (mode: string) => {
    const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
    if (mode?.toUpperCase() === "CASH") {
      return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`;
    } else if (mode?.toUpperCase() === "ONLINE") {
      return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
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

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <>
      <PageMeta title="Payments" description="View your payment history" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all your payments and transactions
          </p>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Total Payments Card */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Paid</p>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{totalAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {payments.length} payment{payments.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Cash Payments Card */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Cash Payments
                </p>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹
                {payments
                  .filter((p) => p.payment_mode?.toUpperCase() === "CASH")
                  .reduce((sum, p) => sum + Number(p.amount), 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {payments.filter((p) => p.payment_mode?.toUpperCase() === "CASH").length} payment
                {payments.filter((p) => p.payment_mode?.toUpperCase() === "CASH").length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* Online Payments Card */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Online Payments
                </p>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹
                {payments
                  .filter((p) => p.payment_mode?.toUpperCase() === "ONLINE")
                  .reduce((sum, p) => sum + Number(p.amount), 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {payments.filter((p) => p.payment_mode?.toUpperCase() === "ONLINE").length} payment
                {payments.filter((p) => p.payment_mode?.toUpperCase() === "ONLINE").length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin dark:border-gray-700"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading payments...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && payments.length === 0 && (
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                No payments yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                You don't have any payments at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Payments Table */}
        {!loading && payments.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.03]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Payment Mode
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {payment.booking_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{Number(payment.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(payment.payment_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPaymentModeBadge(payment.payment_mode)}>
                          {payment.payment_mode?.toUpperCase() || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.03] px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {payments.length}
                </span>{" "}
                payment{payments.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Total: ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerPayments;
