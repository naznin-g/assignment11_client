import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';
import IssueCard from '../Component/IssueCard/IssueCard';

const LatestResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // to check if logged in
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.get('/issues/latest-resolved')
      .then(res => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  if (loading) return <p className="text-center my-6">Loading...</p>;
  if (issues.length === 0) return <p className="text-center my-6">No resolved issues found.</p>;

  const handleViewDetails = (id) => {
    if (!user) {
      // redirect to login and save the intended page
      navigate('/auth/login', { state: { from: `/issue/${id}` } });
    } else {
      navigate(`/issue/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {issues.map(issue => (
        <IssueCard
          key={issue._id}
          issue={issue}
          onViewDetails={() => handleViewDetails(issue._id)}
        />
      ))}
    </div>
  );
};

export default LatestResolvedIssues;
