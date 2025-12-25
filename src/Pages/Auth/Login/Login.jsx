import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { SignInUser } = useAuth();
    //const axiosSecure = useAxiosSecure();
   const location = useLocation();
   const navigate = useNavigate();

    const handleLogin=(data)=>{
        console.log('form data', data);
        SignInUser(data.email, data.password)
        .then(result=>{
            console.log(result.user)
            navigate(location?.state||'/')
        })
        .catch(error=>{
            console.log(error)
        })
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center">Welcome back</h3>
            <p className='text-center'>Please Login</p>
            <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
                <fieldset>
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email && <p className='text-red-500'>Email is required</p>}

                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                    {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be at least 6 characters</p>}

                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
                <p>New to UrbanCare? <Link state={location.state} className='text-blue-400 underline' to="/register">Register</Link></p>
            </form>

            <SocialLogin />
        </div>
    );
};

export default Login;
