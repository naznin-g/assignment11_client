import React from 'react';
import useRole from '../../../hooks/useRole';
import Loading from '../../../Component/Loading/Loading';
import AdminDashboardHome from '../../Admin/AdminDashboard';
import StaffDashboardHome from '../../Staff/StaffDashboard';
import UserDashboardHome from '../../Citizen/CitizenDashboard';

const DashboardHome = () => {
    const { role, roleLoading } = useRole();
    if (roleLoading) {
        return <Loading></Loading>
    }
    if (role === 'admin') {
        return <AdminDashboardHome></AdminDashboardHome>
    }
    else if (role === 'staff') {
        return <StaffDashboardHome></StaffDashboardHome>
    }
    else {
        return <UserDashboardHome></UserDashboardHome>
    }
};

export default DashboardHome;