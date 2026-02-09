import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import Bookings from "./pages/Bookings/Bookings";
import Customers from "./pages/Customers/Customers";
import PublicRoute from "./auth/PublicRoute";
import LandingPage from "./pages/LandingPage";
import TechnicianAssignment from "./pages/Bookings/TechnicianAssignment";
import AssignedBookings from "./pages/Technician/AssignedBookings";
import CompletedBookings from "./pages/Technician/CompletedBookings";
import Payments from "./pages/Payments/Payments";
import ReportSummary from "./pages/Reports/ReportSummary";
import MonthlyBreakdown from "./pages/Reports/MonthlyBreakdown";
import TechnicianMonthlyReport from "./pages/Reports/TechnicianMonthlyReport";
import TestMonthlyReport from "./pages/Reports/TestMonthlyReport";
import BranchList from "./pages/Admin/Branches/BranchList";
import AuditLogs from "./pages/Admin/AuditLogs/AuditLogs";
import Doctors from "./pages/Admin/Doctors/Doctors";
import Tests from "./pages/Admin/Test/Tests";
import BranchUsers from "./pages/BranchAdmin/BranchUsers";
import MyBookings from "./pages/customer/MyBookings";
import CustomerPayments from "./pages/customer/Payments";
import CustomerReports from "./pages/customer/Reports";
import BookingDetails from "./pages/customer/BookingDetails";
import BranchAdmins from "./pages/Admin/BranchAdmins/BranchAdmins";
import About from "./pages/OtherPage/About";
import Blog from "./pages/OtherPage/Blog";
import Careers from "./pages/OtherPage/Careers";
import Privacy from "./pages/OtherPage/Privacy";
import Terms from "./pages/OtherPage/Terms";

import Contact from "./pages/OtherPage/Contact";
import BlogList from "./pages/Admin/Blog/BlogList";
import ContactQueries from "./pages/Admin/ContactQueries/ContactQueries";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing Page for Public Users */}
          <Route
            index
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            {/* <Route path="/calendar" element={<Calendar />} /> */}
            <Route path="/blank" element={<Blank />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings/assign-technician"
              element={
                <ProtectedRoute>
                  <TechnicianAssignment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/tests"
              element={
                <ProtectedRoute>
                  <Tests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/technician/bookings"
              element={
                <ProtectedRoute roles={["TECHNICIAN"]}>
                  <AssignedBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/technician/bookings/completed"
              element={
                <ProtectedRoute roles={["TECHNICIAN"]}>
                  <CompletedBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN", "ADMIN","BRANCH_ADMIN", "RECEPTIONIST", "TECHNICIAN"]}>
                  <Payments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/summary"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"]}>
                  <ReportSummary />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/monthly-breakdown"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"]}>
                  <MonthlyBreakdown />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/technician-monthly-breakdown"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"]}>
                  <TechnicianMonthlyReport />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/test-monthly-breakdown"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN", "BRANCH_ADMIN", "RECEPTIONIST"]}>
                  <TestMonthlyReport />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/branches"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN"]}>
                  <BranchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN"]}>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/branch-admins"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN"]}>
                  <BranchAdmins />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN"]}>
                  <BlogList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute roles={["SUPER_ADMIN"]}>
                  <ContactQueries />
                </ProtectedRoute>
              }
            />

            <Route
              path="/branch-admin/users"
              element={
                <ProtectedRoute roles={["BRANCH_ADMIN"]}>
                  <BranchUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/bookings/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/payments"
              element={
                <ProtectedRoute>
                  <CustomerPayments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/reports"
              element={
                <ProtectedRoute>
                  <CustomerReports />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth Layout */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PublicRoute>
                <About />
              </PublicRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <PublicRoute>
                <Blog />
              </PublicRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <PublicRoute>
                <Careers />
              </PublicRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <PublicRoute>
                <Privacy />
              </PublicRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <PublicRoute>
                <Terms />
              </PublicRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicRoute>
                <Contact />
              </PublicRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
