import React from 'react';
import useRole from '../../hooks/useRole';
import Loading from '../../Component/Loading/Loading';
import AdminDashboard from '../Admin/AdminDashboard';
import StaffDashboard from '../Staff/StaffDashboard';
import CitizenDashboard from '../Citizen/CitizenDashboard';
import { Navigate } from "react-router-dom";

const MyDashboard = () => {
    const { role, roleLoading } = useRole();

    if (roleLoading) {
        return <Loading />;
    }

    if (role === 'admin') {
        return <AdminDashboard />;
    } else if (role === 'staff') {
        return <StaffDashboard />;
    } else {
         return <CitizenDashboard></CitizenDashboard>
    }
};

export default MyDashboard;