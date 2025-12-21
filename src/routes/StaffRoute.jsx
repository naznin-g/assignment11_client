import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../Component/Loading/Loading';
import Forbidden from '../Component/Forbidden/Forbidden';

const StaffRoute = ({ children }) => {
    const { loading, user } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loading></Loading>
    }
    if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

    if (role !== 'staff') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default StaffRoute;