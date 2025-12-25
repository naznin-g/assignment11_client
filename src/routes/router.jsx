import { createBrowserRouter } from "react-router-dom";

/* ================= LAYOUTS ================= */
import RootLayout from "../layouts/RootLayout";

/* ================= PAGES ================= */
import Home from "../Pages/Home/Home/Home";
import AllIssues from "../Pages/AllIssues/AllIssues";
import LatestResolvedIssue from "../Pages/LatestResolvedIssue/LatestResolvedIssue";
import IssueDetails from "../Pages/IssueDetails/IssueDetails";
import TrackIssue from "../Pages/TrackIssue/TrackIssue";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import NotFound from "../Component/NotFound/NotFound";

import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";

import MyDashboard from "../Pages/MyDashboard/MyDashboard";
import CitizenDashboard from "../Pages/Citizen/CitizenDashboard";
import MyIssues from "../Pages/Citizen/MyIssues";
import ReportIssue from "../Pages/Citizen/ReportIssue";
import CitizenProfile from "../Pages/Citizen/Profile";

import AssignedIssues from "../Pages/Staff/AssignedIssues";
import StaffProfile from "../Pages/Staff/StaffProfile";

import AdminAllIssues from "../Pages/Admin/AdminAllIssue";
import ManageUsers from "../Pages/Admin/ManageUsers";
import ManageStaff from "../Pages/Admin/ManageStaff";
import Payments from "../Pages/Admin/Payment";
import AdminProfile from "../Pages/Admin/AdminProfile";

/* ================= ROUTE GUARDS ================= */
import PrivateRoute from "./PrivateRoute";
import CitizenRoute from "./CitizenRoute";
import StaffRoute from "./StaffRoute";
import AdminRoute from "./AdminRoute";
import BlockedGuard from "./BlockedGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      /* ================= PUBLIC ================= */
      { index: true, element: <Home /> },
      { path: "all-issues", element: <AllIssues /> },
      { path: "latest-resolved", element: <LatestResolvedIssue /> },
      { path: "issue/:id", element: <PrivateRoute><IssueDetails /></PrivateRoute> },
      { path: "track-issue", element: <TrackIssue /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      /* ================= AUTH ================= */
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      /* ================= DASHBOARD (ROLE-BASED) ================= */
      {
        path: "my-dashboard",
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
          {index:true, element:<MyDashboard></MyDashboard>},
            
          
          /* -------- Citizen -------- */
          {path:"citizen", element:<CitizenRoute><CitizenDashboard/></CitizenRoute>},
          { path: "citizen/my-issues", element: <CitizenRoute><MyIssues /></CitizenRoute> },
          { path: "citizen/report-issue", element: <CitizenRoute><BlockedGuard><ReportIssue /></BlockedGuard></CitizenRoute> },
          { path: "citizen/profile", element: <CitizenRoute><CitizenProfile /></CitizenRoute> },
            
          
          /* -------- Staff -------- */
          { path: "assigned-issues", element: <StaffRoute><AssignedIssues /></StaffRoute> },
          { path: "staff-profile", element: <StaffRoute><StaffProfile /></StaffRoute> },

          /* -------- Admin -------- */
          { path: "all-issues", element: <AdminRoute><AdminAllIssues /></AdminRoute> },
          { path: "users", element: <AdminRoute><ManageUsers /></AdminRoute> },
          { path: "staff", element: <AdminRoute><ManageStaff /></AdminRoute> },
          { path: "payments", element: <AdminRoute><Payments /></AdminRoute> },
          { path: "admin-profile", element: <AdminRoute><AdminProfile /></AdminRoute> },
        ],
      },

      /* ================= 404 ================= */
      { path: "*", element: <NotFound /> },
    ],
  },
]);
