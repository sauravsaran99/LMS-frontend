import api from "./axios";


export const createPayment = (formData: FormData) =>
  api.post("/payments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const verifyPayment = (paymentId: number) =>
  api.post(`/payments/${paymentId}/verify`);

export const refundPayment = (paymentId: number) =>
  api.post(`/payments/${paymentId}/refund`);

export const getPayments = () => api.get("/payments");

export const getBookingPayments = () => api.get("/payments/bookings");

