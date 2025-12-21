import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-800',
  'in-progress': 'bg-blue-200 text-blue-800',
  working: 'bg-purple-200 text-purple-800',
  resolved: 'bg-green-200 text-green-800',
  closed: 'bg-gray-200 text-gray-800',
};

const priorityColors = {
  normal: 'bg-gray-100 text-gray-800',
  high: 'bg-red-200 text-red-800',
};

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: issues = [], refetch } = useQuery({
    queryKey: ['my-issues', filterStatus],
    queryFn: async () => {
      let url = '/citizen/issues';
      if (filterStatus !== 'all') url += `?status=${filterStatus}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/citizen/issues/${id}`).then(() => {
          Swal.fire('Deleted!', 'Your issue has been deleted.', 'success');
          refetch();
        });
      }
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My Issues</h2>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select select-bordered"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="working">Working</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Upvotes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="hover:bg-base-100 transition">
                <td>
                  {issue.image && (
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      statusColors[issue.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      priorityColors[issue.priority] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {issue.priority}
                  </span>
                </td>
                <td>{issue.location}</td>
                <td>{issue.upvotes || 0}</td>
                <td className="flex flex-col gap-1">
                  {issue.status === 'pending' && (
                    <>
                      <Link
                        to={`/dashboard/edit-issue/${issue._id}`}
                        className="btn btn-sm btn-warning w-full"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(issue._id)}
                        className="btn btn-sm btn-error w-full"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <Link
                    to={`/issue/${issue._id}`}
                    className="btn btn-sm btn-primary w-full"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {issues.length === 0 && (
          <p className="text-center mt-6 text-gray-500">No issues found.</p>
        )}
      </div>
    </div>
  );
};

export default MyIssues;

