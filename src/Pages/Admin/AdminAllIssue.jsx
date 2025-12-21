import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AdminAllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');

  // Fetch all issues
  const { data: issues = [], refetch } = useQuery({
    queryKey: ['admin-all-issues'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/issues');
      return res.data;
    },
  });

  // Fetch all staff
  const { data: staffList = [] } = useQuery({
    queryKey: ['staff-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/staff');
      return res.data;
    },
  });

  // Open modal to assign staff
  const handleAssignClick = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  // Confirm staff assignment
  const handleAssignConfirm = async () => {
    if (!selectedStaff) return Swal.fire('Select staff', '', 'warning');
    try {
      await axiosSecure.patch(`/admin/issues/assign/${selectedIssue._id}`, {
        staffId: selectedStaff
      });
      Swal.fire('Assigned!', 'Staff assigned successfully.', 'success');
      setShowModal(false);
      setSelectedStaff('');
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to assign staff.', 'error');
    }
  };

  // Reject issue
  const handleReject = (issueId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to reject this issue!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.patch(`/admin/issues/reject/${issueId}`);
        Swal.fire('Rejected!', 'Issue has been rejected.', 'success');
        refetch();
      }
    });
  };

  // Sort boosted issues on top
  const sortedIssues = [...issues].sort((a, b) => b.priority === 'high' - a.priority === 'high');

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">All Issues</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned Staff</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
                <td>{issue.assignedStaff ? issue.assignedStaff.name : '-'}</td>
                <td className="flex gap-2">
                  {!issue.assignedStaff && (
                    <button
                      onClick={() => handleAssignClick(issue)}
                      className="btn btn-sm btn-primary"
                    >
                      Assign Staff
                    </button>
                  )}
                  {issue.status === 'pending' && (
                    <button
                      onClick={() => handleReject(issue._id)}
                      className="btn btn-sm btn-error"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Assign Staff to "{selectedIssue.title}"</h3>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              <option value="">Select Staff</option>
              {staffList.map(staff => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAssignConfirm}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllIssues;
