import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all citizen users
  const { data: users = [], refetch } = useQuery({
    queryKey: ['users-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/users');
      return res.data;
    },
  });

  // Handle block/unblock
  const handleBlockToggle = async (user) => {
    const action = user.blocked ? 'Unblock' : 'Block';
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${action.toLowerCase()} ${user.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/admin/users/block-toggle/${user._id}`);
          Swal.fire(`${action}ed!`, `User has been ${action.toLowerCase()}ed.`, 'success');
          refetch();
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Something went wrong.', 'error');
        }
      }
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.subscription === 'premium' ? (
                    <span className="badge badge-success">Premium</span>
                  ) : (
                    <span className="badge badge-info">Free</span>
                  )}
                </td>
                <td>
                  {user.blocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-500 font-semibold">Active</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={`btn btn-sm ${user.blocked ? 'btn-success' : 'btn-error'}`}
                  >
                    {user.blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
