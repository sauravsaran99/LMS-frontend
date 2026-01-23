import api from "./axios";

export const getReportSummary = (fromDate: string, toDate: string) => {
  return api.get("/reports/summary", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });
};

export const exportReportExcel = async (fromDate: string, toDate: string) => {
  const response = await api.get("/reports/export/excel", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob", // 🔑 IMPORTANT
  });

  return response.data;
};

export const exportReportCSV = async (fromDate: string, toDate: string) => {
  const response = await api.get("/reports/export/csv", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob", // 🔑 IMPORTANT
  });

  return response.data;
};

export const getBranchMonthlyReport = (fromDate: string, toDate: string) => {
  return api.get("/reports/monthly-breakdown/branch", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });
};

export const getTechnicianMonthlyReport = (fromDate: string, toDate: string) => {
  return api.get("/reports/monthly-breakdown/technician", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });
};

export const getTestMonthlyReport = (fromDate: string, toDate: string) => {
  return api.get("/reports/monthly-breakdown/test", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });
};

export const uploadReport = (bookingId: number, file: File, taggedDoctorId?: number) => {
  const fd = new FormData();
  fd.append("report", file);
  if (taggedDoctorId) {
    fd.append("tagged_doctor_id", String(taggedDoctorId));
  }
  return api.post(`/bookings/technician/${bookingId}/upload-report`, fd);
};
