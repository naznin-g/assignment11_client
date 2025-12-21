import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const statusColors = {
  pending: 'badge badge-warning',
  'in-progress': 'badge badge-info',
  working: 'badge badge-primary',
  resolved: 'badge badge-success',
  closed: 'badge badge-ghost',
};

const priorityColors = {
  normal: 'badge badge-ghost',
  high: 'badge badge-error',
};

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // number of issues per page

  // Fetch issues
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

  // Pagination calculations
  const totalPages = Math.ceil(issues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIssues = issues.slice(startIndex, endIndex);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My Issues</h2>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1); // reset page when filter changes
          }}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
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
            {paginatedIssues.map(issue => (
              <tr key={issue._id}>
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
                <td><span className={statusColors[issue.status] || 'badge badge-ghost'}>{issue.status}</span></td>
                <td><span className={priorityColors[issue.priority] || 'badge badge-ghost'}>{issue.priority}</span></td>
                <td>{issue.location}</td>
                <td>{issue.upvotes || 0}</td>
                <td className="flex flex-col gap-1">
                  {issue.status === 'pending' && (
                    <>
                      <Link to={`/dashboard/edit-issue/${issue._id}`} className="btn btn-sm btn-warning w-full">Edit</Link>
                      <button onClick={() => handleDelete(issue._id)} className="btn btn-sm btn-error w-full">Delete</button>
                    </>
                  )}
                  <Link to={`/issue/${issue._id}`} className="btn btn-sm btn-primary w-full">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {issues.length === 0 && <p className="text-center mt-6 text-gray-500">No issues found.</p>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-active">
              Page {currentPage}
            </button>
            <button
              className="join-item btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-2">
        Showing {startIndex + 1} to {Math.min(endIndex, issues.length)} of {issues.length} issues
      </p>
    </div>
  );
};

export default MyIssues;


