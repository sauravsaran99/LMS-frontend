import { useState } from "react";
import toast from "react-hot-toast";
import { createRefund } from "../../api/refund.api";

interface RefundModalProps {
  bookingNumber: string;
  refundableAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RefundModal = ({
  bookingNumber,
  refundableAmount,
  onClose,
  onSuccess,
}: RefundModalProps) => {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"CASH" | "ONLINE">("CASH");
  const [referenceNo, setReferenceNo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const refundAmount = Number(amount);

    if (!refundAmount || refundAmount <= 0) {
      toast.error("Enter valid refund amount");
      return;
    }

    if (refundAmount > refundableAmount) {
      toast.error("Refund amount exceeds refundable balance");
      return;
    }

    try {
      setLoading(true);

      await createRefund({
        booking_number: bookingNumber,
        amount: refundAmount,
        refund_mode: mode,
        reference_no: mode === "ONLINE" ? referenceNo : undefined,
      });

      toast.success("Refund processed successfully");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Refund failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Refund Payment</h2>

        <div className="text-sm space-y-1">
          <p>
            <strong>Booking:</strong> {bookingNumber}
          </p>
          <p>
            <strong>Refundable Amount:</strong> ₹{refundableAmount}
          </p>
        </div>

        {/* Refund Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Refund Amount *
          </label>
          <input
            type="number"
            min="1"
            max={refundableAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        {/* Refund Mode */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Refund Mode *
          </label>
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as "CASH" | "ONLINE")
            }
            className="w-full border rounded px-3 py-2"
            disabled={loading}
          >
            <option value="CASH">Cash</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>

        {/* Reference No (ONLINE only) */}
        {mode === "ONLINE" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Reference No
            </label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            {loading ? "Processing..." : "Refund"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
