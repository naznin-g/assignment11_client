import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      const res = await axiosSecure.get('/citizen/profile');
      return res.data;
    },
  });

  const subscribeMutation = useMutation(
    async () => await axiosSecure.post('/citizen/subscribe'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-info']);
        Swal.fire('Success', 'You are now a premium user!', 'success');
      },
    }
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.premium && <span className="badge badge-success">Premium</span>}
        {user.blocked && <span className="badge badge-warning">Blocked</span>}
      </div>

      {!user.premium && (
        <button className="btn btn-primary" onClick={() => subscribeMutation.mutate()}>
          Subscribe (1000tk)
        </button>
      )}
    </div>
  );
};

export default Profile;
