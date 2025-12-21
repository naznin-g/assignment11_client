import React from 'react';
import Logo from '../Component/Logo/Logo';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.png';

const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center px-4'>
            {/* Logo */}
            <div className='mb-6'>
                <Logo />
            </div>

            {/* Form and Image */}
            <div className='flex flex-col lg:flex-row items-center w-full gap-6'>
                {/* Form */}
                <div className='flex-1 w-full lg:w-1/2'>
                    <Outlet />
                </div>

                {/* Image */}
                <div className='flex-1 w-full lg:w-1/2'>
                    <img src={authImage} alt="Authentication" className='w-full h-auto' />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;



