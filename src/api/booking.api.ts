import api from "./axios";

export const searchCustomers = (q: string) =>
  api.get(`/customers/search?q=${q}`);

export const getTests = () =>
  api.get("/tests");

export const previewDiscount = (payload: any) =>
  api.post("/discounts/preview", payload);

export const createBooking = (payload: any) =>
  api.post("/bookings", payload);

export const getBookings = () => api.get("/bookings");

export const assignTechnician = (
  bookingId: number,
  technicianId: number
) =>
  api.post(`/bookings/${bookingId}/assign-technician`, {
    technician_id: technicianId,
  });

  export const getUnassignedBookings = () =>
  api.get("/bookings", {
    params: { status: "CREATED" },
  });