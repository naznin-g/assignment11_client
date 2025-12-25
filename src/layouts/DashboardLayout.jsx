import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTasks, FaUserCircle, FaClipboardList, FaCheckCircle, FaUsers, FaUserTie, FaFileInvoiceDollar, FaChartPie } from 'react-icons/fa';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';
import Loading from '../Component/Loading/Loading';

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { user } = useAuth();
  if (roleLoading){
    return <Loading/>
  }

  return (
    <div className="drawer lg:drawer-open max-w-7xl mx-auto">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <div className="px-4 text-xl font-bold">UrbanCare Dashboard</div>
          <div className="ml-auto flex items-center gap-4">
            {user?.photoURL && <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />}
            <span>{user?.displayName}</span>
          </div>
        </nav>

        {/* Main Outlet */}
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col bg-base-200 w-64 p-4">
          
          {/* User Info */}
          <div className="mb-6 text-center">
            {user?.photoURL && (
              <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full mx-auto mb-2" />
            )}
            <p className="font-semibold">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{role?.toUpperCase()}</p>
          </div>

          {/* Menu Links */}
          <ul className="menu w-full">
            {/* Citizen Links */}
            {role === 'citizen' && (
              <>
                <li><NavLink to="."><FaChartPie /> Summary</NavLink></li>
                <li><NavLink to="my-issues"><FaTasks /> My Issues</NavLink></li>
                <li><NavLink to="report-issue"><FaClipboardList /> Report Issue</NavLink></li>
                <li><NavLink to="profile"><FaUserCircle /> Profile</NavLink></li>
              </>
            )}

            {/* Staff Links */}
            {role === 'staff' && (
              <>
                <li><NavLink to="."><FaChartPie /> Summary</NavLink></li>
                <li><NavLink to="assigned-issues"><FaClipboardList /> Assigned Issues</NavLink></li>
                <li><NavLink to="profile"><FaUserCircle /> Profile</NavLink></li>
              </>
            )}

            {/* Admin Links */}
            {role === 'admin' && (
              <>
                <li><NavLink to="."><FaChartPie /> Dashboard</NavLink></li>
                <li><NavLink to="all-issues"><FaTasks /> All Issues</NavLink></li>
                <li><NavLink to="users"><FaUsers /> Users</NavLink></li>
                <li><NavLink to="staff"><FaUserTie /> Staff</NavLink></li>
                <li><NavLink to="payments"><FaFileInvoiceDollar /> Payments</NavLink></li>
                <li><NavLink to="profile"><FaUserCircle /> Profile</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
