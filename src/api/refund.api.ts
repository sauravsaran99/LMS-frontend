import api from "./axios"; // your configured axios instance

export const createRefund = (payload: {
  booking_number: string;
  amount: number;
  refund_mode: "CASH" | "ONLINE";
  reference_no?: string;
}) => {
  return api.post("/refunds", payload);
};
