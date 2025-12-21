import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      navigate('/login', { state: { from: `/issue/${id}` } });
    }
  }, [user, navigate, id]);

  useEffect(() => {
    axiosSecure.get(`/issues/${id}`)
      .then(res => {
        setIssue(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, axiosSecure]);

  if (loading) return <p>Loading...</p>;
  if (!issue) return <p>Issue not found.</p>;

  const isOwner = user.email === issue.ownerEmail;
  const isStaffAssigned = user.role === 'staff' && issue.assignedStaffEmail === user.email;
  const isAdmin = user.role === 'admin';

  const handleEdit = () => navigate(`/dashboard/edit-issue/${id}`);

  const handleDelete = async () => {
    await axiosSecure.delete(`/issues/${id}`);
    toast.success('Issue deleted');
    navigate('/dashboard/my-issues');
  };

  const handleUpvote = async () => {
    if (isOwner) return toast.error("Cannot upvote your own issue");
    await axiosSecure.post(`/issues/${id}/upvote`);
    setIssue(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
  };

  const handleBoost = async () => {
    const res = await axiosSecure.post(`/issues/${id}/boost-payment`);
    window.location.href = res.data.paymentUrl;
  };

  const handleStatusChange = async (status) => {
    await axiosSecure.patch(`/issues/${id}/status`, { status });
    setIssue(prev => ({ ...prev, status }));
  };

  const handleAssignStaff = async () => {
    await axiosSecure.patch(`/issues/${id}/assign`, { staffEmail: 'staff@example.com' });
    toast.success('Staff assigned');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Issue Card */}
      <div className="card bg-base-100 shadow-lg p-6">
        <h1 className="text-3xl font-bold">{issue.title}</h1>
        <p className="text-gray-600">{issue.category} | Priority: {issue.priority}</p>
        <p className="mb-4">Status: <span className="font-semibold">{issue.status}</span></p>

        <p>{issue.description}</p>
        <p>Location: {issue.location}</p>
        <p>Upvotes: {issue.upvotes || 0}</p>

        {/* Citizen */}
        {isOwner && (
          <div className="flex gap-2 mt-4">
            {issue.status === 'Pending' && <button className="btn btn-outline" onClick={handleEdit}>Edit</button>}
            {issue.status === 'Pending' && <button className="btn btn-error" onClick={handleDelete}>Delete</button>}
            {issue.priority !== 'high' && <button className="btn btn-warning" onClick={handleBoost}>Boost</button>}
            <button className="btn btn-secondary" onClick={handleUpvote}>Upvote</button>
          </div>
        )}

        {/* Staff */}
        {isStaffAssigned && (
          <div className="flex gap-2 mt-4">
            {['In-Progress', 'Resolved', 'Closed'].map(s => (
              <button key={s} className="btn btn-primary" onClick={() => handleStatusChange(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Admin */}
        {isAdmin && !issue.assignedStaffEmail && (
          <div className="flex gap-2 mt-4">
            <button className="btn btn-accent" onClick={handleAssignStaff}>Assign Staff</button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Issue Timeline</h2>

        <ul className="timeline timeline-vertical">
          {issue.timeline?.map((item, index) => (
            <li key={index}>
              {index !== 0 && <hr />}
              <div className="timeline-start text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <div className="timeline-middle">
                <div className="badge badge-success"></div>
              </div>
              <div className="timeline-end timeline-box">
                <p className="font-semibold capitalize">{item.status}</p>
                <p className="text-sm text-gray-500">{item.details}</p>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default IssueDetails;
