import { useState } from "react";
import toast from "react-hot-toast";
import { createPayment } from "../../api/payment.api";
import DatePicker from "../../components/form/date-picker";

const CreatePaymentModal = ({ onClose, bookingNumber: initialBookingNumber }: any) => {
  const [bookingNumber, setBookingId] = useState(initialBookingNumber || "");
  const [paymentDate, setPaymentDate] = useState("");
  const [mode, setMode] = useState("CASH");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");


  const submit = async () => {

    if (mode === "ONLINE" && !file) {
  toast.error("Please upload payment proof");
}


  if (!bookingNumber.trim()) {
    toast.error("Booking number is required");
    return;
  }

  if (!amount || Number(amount) <= 0) {
    toast.error("Valid amount is required");
    return;
  }

  if (mode === "ONLINE" && !file) {
    toast.error("Please upload payment proof");
    return;
  }

  const fd = new FormData();
  fd.append("booking_number", bookingNumber);
  fd.append("amount", amount);                // ✅ IMPORTANT
  fd.append("payment_mode", mode);
  fd.append("payment_date", paymentDate);     // ✅ IMPORTANT

  if (mode === "ONLINE" && file) {
    fd.append("proof", file);
  }

  try {
    setLoading(true);
    await createPayment(fd);
    toast.success("Payment added successfully");
    onClose();
  } catch (e: any) {
    toast.error(e.response?.data?.message || "Failed to create payment");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Payment</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add a new payment transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Booking ID Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Booking ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter booking number (e.g., BK12345)"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              value={bookingNumber}
              onChange={(e) => setBookingId(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Payment Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <DatePicker 
              id="payment-date"
              placeholder="Select payment date"
              onChange={(date: any) => {
                if (date && date[0]) {
                  const d = date[0];
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  const selectedDate = `${year}-${month}-${day}`;
                  setPaymentDate(selectedDate);
                }
              }}
            />
          </div>

          <div>
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
    Payment Amount
    <span className="text-red-500 ml-1">*</span>
  </label>
  <input
    type="number"
    min="1"
    placeholder="Enter amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    disabled={loading}
    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
  />
</div>


          {/* Payment Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Payment Mode
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer" style={{ borderColor: mode === "CASH" ? "#465fff" : "#e5e7eb", backgroundColor: mode === "CASH" ? "#f0f4ff" : undefined }} onMouseEnter={(e) => !mode === "CASH" && e.currentTarget.style.borderColor === "#465fff" ? null : (e.currentTarget.style.borderColor = "#d1d5db")} onMouseLeave={(e) => !mode === "CASH" && (e.currentTarget.style.borderColor = "#e5e7eb")}>
                <input
                  type="radio"
                  name="mode"
                  value="CASH"
                  checked={mode === "CASH"}
                  onChange={(e) => {
                    setMode(e.target.value);
                    setFile(null);
                  }}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <span className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-lg">💵</span>
                  <div>
                    <div className="font-semibold">Cash Payment</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Direct cash payment</div>
                  </div>
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer" style={{ borderColor: mode === "ONLINE" ? "#465fff" : "#e5e7eb", backgroundColor: mode === "ONLINE" ? "#f0f4ff" : undefined }} onMouseEnter={(e) => !mode === "ONLINE" && e.currentTarget.style.borderColor === "#465fff" ? null : (e.currentTarget.style.borderColor = "#d1d5db")} onMouseLeave={(e) => !mode === "ONLINE" && (e.currentTarget.style.borderColor = "#e5e7eb")}>
                <input
                  type="radio"
                  name="mode"
                  value="ONLINE"
                  checked={mode === "ONLINE"}
                  onChange={(e) => setMode(e.target.value)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <span className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-lg">📄</span>
                  <div>
                    <div className="font-semibold">ONLINE with Proof</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Upload proof document</div>
                  </div>
                </span>
              </label>
            </div>
          </div>

          {/* File Upload (Conditional) */}
          {mode === "ONLINE" && (
            <div className="space-y-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Upload Proof Document
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={loading}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full p-4 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <svg className="w-10 h-10 text-blue-500 dark:text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    {!file && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading || !bookingNumber.trim() || !paymentDate || (mode === "ONLINE" && !file)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {loading ? "Creating..." : "Create Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePaymentModal;
