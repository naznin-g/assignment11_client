import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

// Allowed status transitions
const allowedTransitions = {
  Pending: ['In-Progress'],
  'In-Progress': ['Working'],
  Working: ['Resolved'],
  Resolved: ['Closed'],
  Closed: [],
};

const AssignedIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({ status: '', priority: '' });

  // Fetch assigned issues
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['staff-assigned-issues'],
    queryFn: async () => {
      const res = await axiosSecure.get('/staff/issues/assigned');
      return res.data;
    },
  });

  // Mutation to update status
  const updateStatusMutation = useMutation(
    async ({ id, newStatus }) => {
      const res = await axiosSecure.patch(`/staff/issues/${id}/status`, { status: newStatus });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['staff-assigned-issues']);
        Swal.fire('Success', 'Status updated successfully!', 'success');
      },
      onError: () => {
        Swal.fire('Error', 'Failed to update status', 'error');
      },
    }
  );

  if (isLoading) return <p>Loading...</p>;

  // Filtered & boosted issues
  const filteredIssues = issues
    .filter(issue => (filter.status ? issue.status === filter.status : true))
    .filter(issue => (filter.priority ? issue.priority === filter.priority : true))
    .sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0));

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Assigned Issues</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="select select-bordered"
          value={filter.status}
          onChange={e => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          {Object.keys(allowedTransitions).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="select select-bordered"
          value={filter.priority}
          onChange={e => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Boosted</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
                <td>{issue.boosted ? 'Yes' : 'No'}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={issue.status}
                    onChange={e => handleStatusChange(issue._id, e.target.value)}
                  >
                    <option value={issue.status}>{issue.status}</option>
                    {allowedTransitions[issue.status].map(statusOption => (
                      <option key={statusOption} value={statusOption}>{statusOption}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedIssues;

