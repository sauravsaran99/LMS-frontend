import { useState } from "react";
import toast from "react-hot-toast";
import { markBookingCompleted } from "../api/technician.api";
import CreatePaymentModal from "../pages/Payments/CreatePaymentModal";
import UploadReportModal from "../pages/Technician/UploadReportModal";

interface CompleteBookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  booking?: any;
  bookingNumber?: string;
  customerName?: string;
  onSuccess?: () => void;
  pendingAmount: string | number;
}

const CompleteBookingPopup = ({
  isOpen,
  onClose,
  bookingId,
  booking,
  bookingNumber = "",
  customerName = "",
  onSuccess,
  pendingAmount = 0,
}: CompleteBookingPopupProps) => {
  const [step, setStep] = useState<"confirm" | "report" | "payment">("confirm"); // confirm -> report -> payment
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await markBookingCompleted(bookingId);
      setStep("report");
      toast.success("Booking marked as completed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportUploadComplete = () => {
    setShowReportModal(false);
    setStep("payment");
    toast.success("Report uploaded successfully");
  };

  const handlePaymentModalClose = () => {
    setStep("confirm");
    onClose();
    onSuccess?.();
  };

  const handleSkipReport = () => {
    setStep("payment");
  };

  if (!isOpen) return null;

  // Show CreatePaymentModal if payment step
  if (step === "payment" && !showReportModal) {
    return (
      <CreatePaymentModal
        onClose={handlePaymentModalClose}
        bookingNumber={bookingNumber}
        pendingAmount={pendingAmount}
      />
    );
  }

  // Show UploadReportModal if report step
  if (showReportModal) {
    return (
      <UploadReportModal
        booking={booking || { id: bookingId }}
        onClose={() => setShowReportModal(false)}
        onSuccess={handleReportUploadComplete}
      />
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full animate-scale-in">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40">
                {step === "confirm" && (
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {step === "report" && (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                {step === "payment" && (
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {step === "confirm" && "Confirm Booking Completion"}
                  {step === "report" && "Upload Test Report"}
                  {step === "payment" && "Process Payment"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Step {step === "confirm" ? 1 : step === "report" ? 2 : 3} of 3
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {step === "confirm" && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Are you sure you want to mark this booking as completed? This action cannot be
                  undone.
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-5 space-y-3 border border-blue-200/50 dark:border-blue-800/50">
                  {bookingNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Booking ID
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                        {bookingNumber}
                      </span>
                    </div>
                  )}
                  {customerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Customer
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                        {customerName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 flex gap-2">
                  <svg
                    className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
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
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    You will be able to upload a test report and process payment after marking as
                    completed.
                  </p>
                </div>
              </div>
            )}

            {step === "report" && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Would you like to upload a test report? This is optional but recommended.
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Booking Completed
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Your booking has been successfully marked as completed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload Test Report
                  </button>
                  <button
                    onClick={handleSkipReport}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    Skip & Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-success-600 dark:text-success-400"
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">All set!</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ready to process payment
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-300">
                    Summary
                  </h3>
                  <div className="text-xs text-green-800 dark:text-green-300 space-y-1">
                    <p>✓ Booking completed</p>
                    <p>✓ Ready for payment processing</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Click the button below to proceed with payment
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            {step === "confirm" && (
              <>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
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
                      Confirm & Continue
                    </>
                  )}
                </button>
              </>
            )}

            {step === "report" && (
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
            )}

            {step === "payment" && (
              <button
                onClick={() => setStep("payment")}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-success-600 to-success-700 text-white font-medium hover:from-success-700 hover:to-success-800 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Process Payment
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default CompleteBookingPopup;
