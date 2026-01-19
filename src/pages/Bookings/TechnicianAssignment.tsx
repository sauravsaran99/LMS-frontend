import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUnassignedBookings, assignTechnician } from "../../api/booking.api";
import { getTechnicians } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";

const TechnicianAssignment = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const canAssign =
    user?.role === "SUPER_ADMIN" || user?.role === "BRANCH_ADMIN" || user?.role === "RECEPTIONIST";

  const loadData = async () => {
    try {
      setLoading(true);
      const [bRes, tRes] = await Promise.all([getUnassignedBookings(), getTechnicians()]);
      setBookings(bRes.data.data);
      setTechnicians(tRes.data.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAssign) {
      loadData();
    }
  }, []);

  const handleAssign = async (bookingId: number, technicianId: number) => {
    try {
      setAssigningId(bookingId);
      await assignTechnician(bookingId, technicianId);
      toast.success("Technician assigned successfully");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign technician");
    } finally {
      setAssigningId(null);
    }
  };

  if (!canAssign) {
    return (
      <>
        <PageMeta title="Technician Assignment" description="Assign technicians to bookings" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-red-800 dark:text-red-400">Access Denied</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              You don't have permission to access this page. Only administrators and receptionists
              can assign technicians.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Technician Assignment"
        description="Assign technicians to pending bookings"
      />
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Technician Assignment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assign qualified technicians to pending test bookings
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading pending bookings...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {bookings.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] text-center max-w-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-600"
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
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    No Pending Assignments
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All bookings have been assigned to technicians. Check back later for new pending
                    assignments.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header */}
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20">
                        <th className="px-6 py-4 text-left">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Booking ID
                          </p>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Customer
                          </p>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Scheduled Date
                          </p>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Assign Technician
                          </p>
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <code className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded">
                                {booking.booking_number}
                              </code>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                {booking.Customer?.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {booking.Customer?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {booking.Customer?.phone || "No phone"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.scheduled_date}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {booking.scheduled_time}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              defaultValue=""
                              onChange={(e) =>
                                e.target.value && handleAssign(booking.id, Number(e.target.value))
                              }
                              disabled={assigningId === booking.id}
                              className="relative appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                              }}
                            >
                              <option value="" disabled>
                                {assigningId === booking.id ? "Assigning..." : "Select technician"}
                              </option>
                              {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                  {tech.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20 px-6 py-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Showing <span className="font-semibold">{bookings.length}</span> pending
                    assignment{bookings.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TechnicianAssignment;
