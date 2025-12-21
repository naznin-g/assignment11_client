import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(true);

  // Fetch admin info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get('/admin/profile');
        const data = res.data;
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('phone', data.phone);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [axiosSecure, setValue]);

  const onSubmit = async (data) => {
    try {
      await axiosSecure.put('/admin/profile', data);
      Swal.fire('Success', 'Profile updated successfully', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-3xl mb-4">Admin Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input type="text" {...register('name', { required: true })} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" {...register('email', { required: true })} className="input input-bordered w-full" disabled />
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="text" {...register('phone')} className="input input-bordered w-full" />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">Update Profile</button>
      </form>
    </div>
  );
};

export default AdminProfile;
