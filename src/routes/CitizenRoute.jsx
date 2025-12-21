import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../Component/Loading/Loading';
import Forbidden from '../Component/Forbidden/Forbidden';

const CitizenRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const { role, roleLoading } = useRole();

  // 1️⃣ Still checking auth or role
  if (loading || roleLoading) {
    return <Loading />;
  }

  // 2️⃣ Not logged in → go to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3️⃣ Logged in but not a citizen
  if (role !== 'citizen') {
    return <Forbidden />;
  }

  // 4️⃣ Citizen → allow access
  return children;
};

export default CitizenRoute;
