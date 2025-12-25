import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import Loading from "../../Component/Loading/Loading";


const MyDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔁 Redirect based on role
  if (role === "citizen") {
    return <Navigate to="/my-dashboard/citizen" replace />;
  }

  if (role === "staff") {
    return <Navigate to="/my-dashboard/staff" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/my-dashboard/admin" replace />;
  }

  // fallback safety
  return <Navigate to="/unauthorized" replace />;
};

export default MyDashboard;
