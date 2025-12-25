import React, { useEffect, useState } from 'react';
import Logo from '../../../Component/Logo/Logo';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const NavBar = () => {
    const { user, logOut } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [dbUser, setDbUser] = useState(null); 
    const [role, setRole] = useState('');

   useEffect(() => {
  if (user?.email) {
    axiosSecure.get(`/users?email=${user.email}`)
      .then(res => {
        const mongoUser = res.data[0];
        setDbUser(mongoUser);
        setRole(mongoUser?.role || 'citizen');
      })
      .catch(err => console.error(err));
  }
}, [user]);

    const handleLogOut = () => {
        logOut().catch(err => console.log(err));
    };

    // Role-based dashboard link
    const dashboardLink =
        role === 'admin' ? '/admin/dashboard' :
        role === 'staff' ? '/staff/dashboard' :
        '/citizen/dashboard';

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">
            {/* Left: Logo */}
            <div className="navbar-start">
                <Logo />
            </div>

            {/* Center: Links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/allIssues">All Issues</NavLink></li>
                    <li><NavLink to="/track-issue">Track Issue</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>

                    {user && (
                        <li><NavLink to="/my-dashboard">My Dashboard</NavLink></li>
                    )}
                </ul>
            </div>

            {/* Right: Login / User info */}
            <div className="navbar-end flex items-center gap-4">
                {!user ? (
                    <Link to="/login" className="btn btn-primary text-white">
                        Login
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
  <img
    src={dbUser?.photoURL || user?.photoURL }
    alt={dbUser?.displayName || user?.displayName }
    className="w-8 h-8 rounded-full"
  />
  <span className="font-medium">
    {dbUser?.displayName || user?.displayName }
  </span>
  <button onClick={handleLogOut} className="btn btn-primary text-white">
    Log Out
  </button>
</div>

                )}
            </div>

            {/* Mobile menu */}
 <div className="navbar-end lg:hidden pr-6">
  <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-ghost">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </label>
    <ul
      tabIndex={0}
      className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/allIssues">All Issues</NavLink></li>
      <li><NavLink to="/track-issue">Track Issue</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/contact">Contact</NavLink></li>
      {user && <li><NavLink to="/my-dashboard">My Dashboard</NavLink></li>}
    </ul>
  </div>
</div>


        </div>
    );
};

export default NavBar;
