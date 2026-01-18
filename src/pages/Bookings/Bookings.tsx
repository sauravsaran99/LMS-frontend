import { useEffect, useState } from "react";
import { searchCustomers, getTests, previewDiscount, createBooking } from "../../api/booking.api";
import { Customer, Test, DiscountPreview } from "../../types/booking";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import DatePicker from "../../components/form/date-picker";
import TimePicker from "../../components/form/time-picker";
import CreatePaymentModal from "../Payments/CreatePaymentModal";

const Bookings = () => {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);

  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [amount, setAmount] = useState<DiscountPreview | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);

  useEffect(() => {
    getTests().then((res) => setTests(res.data));
  }, []);

  const handleCustomerSearch = async () => {
    const res = await searchCustomers(query);
    setCustomers(res.data);
  };

  const handleTestToggle = (id: number) => {
    setSelectedTests((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handlePreviewDiscount = async () => {
    const total = tests
      .filter((t) => selectedTests.includes(t.id))
      .reduce((sum, t) => sum + Number(t.price), 0);

    const res = await previewDiscount({
      amount: total,
      discount_type: discountType,
      discount_value: discountValue,
    });

    setAmount(res.data);
  };

  const validateBooking = () => {
    if (!selectedCustomer) return "Please select a customer";
    if (selectedTests.length === 0) return "Select at least one test";
    if (!date) return "Select booking date";
    if (!time) return "Select booking time";
    return "";
  };

  const resetBookingForm = () => {
    setSelectedCustomer(null);
    setQuery("");
    setSelectedTests([]);
    setDiscountType("");
    setDiscountValue(0);
    setAmount(null);
    setDate("");
    setTime("");
    setCustomers([]);
    setBookingNumber(null);
    setShowPaymentModal(false);
  };

  console.log("date", date);

  const handleCreateBooking = async () => {
    const validationError = validateBooking();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await createBooking({
        customer_id: selectedCustomer!.id,
        test_ids: selectedTests,
        scheduled_date: date,
        scheduled_time: time,
        discount_type: discountType || undefined,
        discount_value: discountValue || undefined,
      });

      toast.success("Booking created successfully");

      // Extract booking number from response and open payment modal
      console.log("response", response);
      const bookingNum = response.data?.booking?.booking_number || response.data?.id;
      setBookingNumber(bookingNum);
      setShowPaymentModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create booking");
      // setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Create Booking" description="Create a new test booking" />
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Create Booking
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Schedule and manage test bookings for customers
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
            <p className="text-sm font-medium text-green-800 dark:text-green-400">{success}</p>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Main Form - Spans 2 cols on desktop */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Customer Selection Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
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
                      d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM12 14a8 8 0 00-8 8v2h16v-2a8 8 0 00-8-8z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                    placeholder="Search customer"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    onClick={handleCustomerSearch}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>

                {/* Selected Customer Display */}
                {selectedCustomer && (
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                          Selected Customer
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mt-1 truncate">
                          {selectedCustomer.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCustomer(null);
                          setQuery("");
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer List */}
                {customers.length > 0 && !selectedCustomer && (
                  <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 shadow-sm">
                    {customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomer(c);
                          setCustomers([]);
                          setQuery("");
                        }}
                        className="w-full text-left p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                          {c.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {c.phone}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tests Selection Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Tests
                </h2>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {tests.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
                    Loading tests...
                  </p>
                ) : (
                  tests.map((test) => (
                    <label
                      key={test.id}
                      className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={() => handleTestToggle(test.id)}
                        className="w-4 h-4 rounded cursor-pointer accent-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {test.name}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap flex-shrink-0">
                        ₹{test.price}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Schedule Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow relative z-0">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  id="booking-date-picker"
                  mode="single"
                  label="Booking Date"
                  placeholder="Select date"
                  onChange={(selectedDates) => {
                    if (selectedDates[0]) {
                      const date = selectedDates[0];

                      const dateStr =
                        date.getFullYear() +
                        "-" +
                        String(date.getMonth() + 1).padStart(2, "0") +
                        "-" +
                        String(date.getDate()).padStart(2, "0");

                      setDate(dateStr);
                    }
                  }}
                />
                <TimePicker
                  id="booking-time-picker"
                  label="Booking Time"
                  placeholder="Select time"
                  onChange={(selectedDates) => {
                    if (selectedDates[0]) {
                      const timeStr = selectedDates[0].toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });
                      setTime(timeStr);
                    }
                  }}
                />
              </div>
            </div>

            {/* Discount Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <svg
                    className="w-6 h-6 text-orange-600 dark:text-orange-400"
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Apply Discount
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
                <div className="relative z-10">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/50"
                  >
                    <option value="">No Discount</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    placeholder="0"
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-900/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    &nbsp;
                  </label>
                  <button
                    onClick={handlePreviewDiscount}
                    className="w-full rounded-lg border border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 transition-all hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Booking Summary
              </h3>

              {/* Selected Tests Summary */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Selected Tests
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedTests.length}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                  {selectedTests.length === 0 ? (
                    <p>No tests selected</p>
                  ) : (
                    tests
                      .filter((t) => selectedTests.includes(t.id))
                      .map((t) => (
                        <div key={t.id} className="flex justify-between">
                          <span>{t.name}</span>
                          <span>₹{t.price}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Amount Summary */}
              {amount && (
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Original
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      ₹{amount.original_amount.toFixed(2)}
                    </span>
                  </div>
                  {amount.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                        Discount
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">
                        -₹{amount.discount_amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Final Amount
                    </span>
                    <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₹{amount.final_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleCreateBooking}
                disabled={loading || !selectedCustomer || selectedTests.length === 0}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-2.5 sm:py-3 text-center text-sm sm:text-base font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-10 sm:min-h-12"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">...</span>
                  </span>
                ) : (
                  "Create Booking"
                )}
              </button>

              {/* Helper Text */}
              {(!selectedCustomer || selectedTests.length === 0) && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Complete all required fields
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <CreatePaymentModal bookingNumber={bookingNumber} onClose={resetBookingForm} />
      )}
    </>
  );
};

export default Bookings;
