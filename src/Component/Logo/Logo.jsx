import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2">
            {/* Set logo height to match navbar */}
            <img src={logo} alt="UrbanCare Logo" className="h-10 w-auto" />
            <h3 className="text-2xl font-bold">UrbanCare</h3>
        </Link>
    );
};

export default Logo;
