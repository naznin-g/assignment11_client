import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const handleRegistration = (data) => {
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(() => {
                const formData = new FormData();
                formData.append('image', profileImg);

                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

                axios.post(image_API_URL, formData)
                    .then(res => {
                        const photoURL = res.data.data.url;

                        // 1️⃣ Create user in database
                        const userInfo = {
                            email: data.email,
                            displayName: data.name,
                            photoURL: photoURL,
                            role: 'citizen',        // all registering users are citizens
                            isBlocked: false,       // new users are not blocked
                            subscription: 'free'    // default subscription
                        };

                        axiosSecure.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    console.log('User created in the database');
                                }
                            });

                        // 2️⃣ Update Firebase profile
                        const userProfile = {
                            displayName: data.name,
                            photoURL: photoURL
                        };

                        updateUserProfile(userProfile)
                            .then(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Registration Successful',
                                    text: 'Welcome to UrbanCare!'
                                });
                                const from = location.state?.from?.pathname || '/dashboard';
                                navigate(from, { replace: true });
                            })
                            .catch(error => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Profile Update Failed',
                                    text: error.message
                                });
                            });
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Image Upload Failed',
                            text: error.message
                        });
                    });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: error.message
                });
            });
    };

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shadow-2xl">
            <h3 className="text-3xl text-center">Welcome to UrbanCare</h3>
            <p className='text-center'>Please Register</p>
            <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
                <fieldset>
                    <label className="label">Name</label>
                    <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />
                    {errors.name && <p className='text-red-500'>Name is required.</p>}

                    <label className="label">Photo</label>
                    <input type="file" {...register('photo', { required: true })} className="file-input" />
                    {errors.photo && <p className='text-red-500'>Photo is required.</p>}

                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email && <p className='text-red-500'>Email is required.</p>}

                    <label className="label">Password</label>
                    <input type="password" {...register('password', {
                        required: true,
                        minLength: 6,
                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                    })} className="input" placeholder="Password" />
                    {errors.password?.type === 'required' && <p className='text-red-500'>Password is required.</p>}
                    {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be at least 6 characters</p>}
                    {errors.password?.type === 'pattern' && <p className='text-red-500'>Password must include uppercase, lowercase, number, and special character</p>}

                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>

                <p className='text-center mt-2'>
                    Already have an account? <Link state={location.state} className='text-blue-400 underline' to="/login">Login</Link>
                </p>
            </form>

            <SocialLogin />
        </div>
    );
};

export default Register;
