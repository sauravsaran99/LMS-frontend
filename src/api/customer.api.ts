import api from "./axios";
import { Customer } from "../types/customer";

export const searchCustomers = (q: string, myBranchOnly?: boolean) =>
  api.get<{ data: Customer[]; total: number }>(`/customers/search`, { params: { q, myBranchOnly } });

export const createCustomer = (payload: FormData) => api.post("/customers", payload, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const getCustomers = (params?: { page?: number; limit?: number; myBranchOnly?: boolean }) =>
  api.get("/customers", { params });

export const updateCustomer = (id: number, data: FormData) => api.put(`/customers/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const toggleCustomerStatus = (id: number) => api.patch(`/customers/${id}/status`);

/**
 * Get logged-in customer profile
 */
export const getCustomerMe = () => {
  return api.get("/customers/me");
};

/**
 * Get all bookings of logged-in customer
 */
export const getCustomerBookings = () => {
  return api.get("/customers/bookings");
};

/**
 * Get tests for a specific booking (customer-owned)
 */
export const getCustomerBookingTests = (bookingId: number) => {
  return api.get(`/customers/bookings/${bookingId}/tests`);
};

/**
 * Get reports for a specific booking
 */
export const getCustomerBookingReports = (bookingId: number) => {
  return api.get(`/customers/bookings/${bookingId}/reports`);
};

/**
 * Get payments for a booking (by booking number)
 */
export const getCustomerBookingPayments = (bookingNumber: string) => {
  return api.get(`/customers/bookings/${bookingNumber}/payments`);
};
