import { createBrowserRouter } from "react-router-dom";

/* ================= LAYOUTS ================= */
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

/* ================= PUBLIC Pages ================= */
import Home from "../Pages/Home/Home";
import AllIssues from "../Pages/AllIssues/AllIssues";
import IssueDetails from "../Pages/IssueDetails/IssueDetails";
import TrackIssue from "../Pages/TrackIssue/TrackIssue";
import LatestResolvedIssues from "../Pages/LatestResolvedIssues/LatestResolvedIssues";

import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import NotFound from "../Pages/NotFound/NotFound";

/* ================= AUTH Pages ================= */
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";

/* ================= CITIZEN ================= */
import CitizenDashboard from "../Pages/Citizen/Dashboard";
import MyIssues from "../Pages/Citizen/MyIssues";
import ReportIssue from "../Pages/Citizen/ReportIssue";
import CitizenProfile from "../Pages/Citizen/Profile";

/* ================= STAFF ================= */
import StaffDashboard from "../Pages/Staff/Dashboard";
import AssignedIssues from "../Pages/Staff/AssignedIssues";
import StaffProfile from "../Pages/Staff/Profile";

/* ================= ADMIN ================= */
import AdminDashboard from "../Pages/Admin/Dashboard";
import AdminAllIssues from "../Pages/Admin/AllIssues";
import ManageUsers from "../Pages/Admin/ManageUsers";
import ManageStaff from "../Pages/Admin/ManageStaff";
import Payments from "../Pages/Admin/Payments";
import AdminProfile from "../Pages/Admin/Profile";

/* ================= ROUTE GUARDS ================= */
import PrivateRoute from "./PrivateRoute";
import CitizenRoute from "./CitizenRoute";
import StaffRoute from "./StaffRoute";
import AdminRoute from "./AdminRoute";
import BlockedGuard from "./BlockedGuard";

export const router = createBrowserRouter([
  /* ================= PUBLIC ================= */
    {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-issues", element: <AllIssues /> },
      { path: "latest-resolved", element: <LatestResolvedIssues /> }, // <--- NEW
      {
        path: "issue/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      { path: "track-issue", element: <TrackIssue /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  /* ================= AUTH ================= */
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  /* ================= DASHBOARD (ALL ROLES) ================= */
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      /* -------- Dashboard Home (Role Based) -------- */
      {
        index: true,
        element: (
          <>
            <CitizenRoute>
              <CitizenDashboard />
            </CitizenRoute>

            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>

            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </>
        ),
      },

      /* -------- Citizen -------- */
      {
        path: "my-issues",
        element: (
          <CitizenRoute>
            <MyIssues />
          </CitizenRoute>
        ),
      },
      {
        path: "report-issue",
        element: (
          <CitizenRoute>
            <BlockedGuard>
              <ReportIssue />
            </BlockedGuard>
          </CitizenRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <CitizenRoute>
            <CitizenProfile />
          </CitizenRoute>
        ),
      },

      /* -------- Staff -------- */
      {
        path: "assigned-issues",
        element: (
          <StaffRoute>
            <AssignedIssues />
          </StaffRoute>
        ),
      },
      {
        path: "staff-profile",
        element: (
          <StaffRoute>
            <StaffProfile />
          </StaffRoute>
        ),
      },

      /* -------- Admin -------- */
      {
        path: "all-issues",
        element: (
          <AdminRoute>
            <AdminAllIssues />
          </AdminRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "staff",
        element: (
          <AdminRoute>
            <ManageStaff />
          </AdminRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <AdminRoute>
            <Payments />
          </AdminRoute>
        ),
      },
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
    ],
  },

  /* ================= 404 ================= */
  {
    path: "*",
    element: <NotFound />,
  },
]);
