import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { Button } from '../Component/UI/Button';
import Timeline from '../Component/Timeline/Timeline';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user?.email) {
      navigate('/login', { state: { from: `/issue/${id}` } });
    }
  }, [user, navigate, id]);

  // Fetch issue details
  useEffect(() => {
    axiosSecure.get(`/issues/${id}`)
      .then(res => {
        setIssue(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, axiosSecure]);

  if (loading) return <p>Loading...</p>;
  if (!issue) return <p>Issue not found.</p>;

  const isOwner = user.email === issue.ownerEmail;
  const isStaffAssigned = user.role === 'staff' && issue.assignedStaffEmail === user.email;
  const isAdmin = user.role === 'admin';

  // Citizen actions
  const handleEdit = () => {
    navigate(`/dashboard/edit-issue/${id}`);
  };

  const handleDelete = () => {
    axiosSecure.delete(`/issues/${id}`)
      .then(() => {
        toast.success('Issue deleted successfully!');
        navigate('/dashboard/my-issues');
      })
      .catch(err => toast.error('Failed to delete issue'));
  };

  const handleUpvote = async () => {
    if (user.email === issue.ownerEmail) return toast.error("Cannot upvote your own issue");

    try {
      await axiosSecure.post(`/issues/${id}/upvote`);
      setIssue(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
      toast.success("Upvoted successfully!");
    } catch (err) {
      toast.error("Failed to upvote issue");
    }
  };

  const handleBoost = async () => {
    try {
      const res = await axiosSecure.post(`/issues/${id}/boost-payment`);
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      toast.error("Failed to initiate boost payment");
    }
  };

  // Staff actions
  const handleStatusChange = (newStatus) => {
    axiosSecure.patch(`/issues/${id}/status`, { status: newStatus })
      .then(() => {
        setIssue(prev => ({ ...prev, status: newStatus }));
        toast.success("Status updated!");
      })
      .catch(() => toast.error("Failed to update status"));
  };

  // Admin actions
  const handleAssignStaff = async (staffEmail) => {
    try {
      await axiosSecure.patch(`/issues/${id}/assign`, { staffEmail });
      setIssue(prev => ({ ...prev, assignedStaffEmail: staffEmail }));
      toast.success("Staff assigned!");
    } catch {
      toast.error("Failed to assign staff");
    }
  };

  const handleReject = () => {
    axiosSecure.patch(`/issues/${id}/status`, { status: 'Rejected' })
      .then(() => {
        setIssue(prev => ({ ...prev, status: 'Rejected' }));
        toast.success("Issue rejected");
      })
      .catch(() => toast.error("Failed to reject issue"));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="card p-6 shadow-lg bg-base-100">
        <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
        <p className="text-gray-600 mb-2">{issue.category} | Priority: <span className={issue.priority === 'high' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{issue.priority}</span></p>
        <p className="text-gray-600 mb-4">Status: <span className={`font-semibold ${issue.status === 'resolved' ? 'text-green-600' : 'text-gray-600'}`}>{issue.status}</span></p>
        <p className="mb-2">{issue.description}</p>
        <p className="mb-2">Location: {issue.location}</p>
        <p className="mb-2">Upvotes: {issue.upvotes || 0}</p>
        {issue.assignedStaffEmail && <p className="mb-2">Assigned Staff: {issue.assignedStaffName || issue.assignedStaffEmail}</p>}

        {/* Citizen Actions */}
        {isOwner && (
          <div className="flex gap-2 mt-4">
            {issue.status === 'Pending' && <Button onClick={handleEdit}>Edit Issue</Button>}
            {issue.status === 'Pending' && <Button onClick={handleDelete}>Delete Issue</Button>}
            {issue.priority !== 'high' && <Button onClick={handleBoost}>Boost Issue</Button>}
            <Button onClick={handleUpvote}>Upvote</Button>
          </div>
        )}

        {/* Staff Actions */}
        {isStaffAssigned && (
          <div className="flex gap-2 mt-4">
            {['In-Progress', 'Resolved', 'Closed'].map(status => (
              <Button key={status} onClick={() => handleStatusChange(status)}>{status}</Button>
            ))}
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && !issue.assignedStaffEmail && (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleAssignStaff('staff@example.com')}>Assign Staff</Button>
            {issue.status === 'Pending' && <Button onClick={handleReject}>Reject Issue</Button>}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Issue Timeline</h2>
        <Timeline entries={issue.timeline} />
      </div>
    </div>
  );
};

export default IssueDetails;
