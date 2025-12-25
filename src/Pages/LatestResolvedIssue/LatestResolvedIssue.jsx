import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import IssueCard from '../IssueCard/IssueCard';

const LatestResolvedIssues = () => {
  const axios = useAxios(); // ✅ public axios
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get('/issues/latest-resolved')
      .then(res => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [axios]);

  return (
    <section className="max-w-6xl mx-auto my-16 px-4">
      {/* ✅ ALWAYS VISIBLE */}
      <h2 className="text-3xl font-bold text-center mb-2">
        Latest Resolved Issues
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Recently resolved public infrastructure issues
      </p>

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {/* ❌ Server error */}
      {!loading && error && (
        <p className="text-center text-red-500">
          Unable to load resolved issues. Please try again later.
        </p>
      )}

      {/* ⚠️ No resolved issues */}
      {!loading && !error && issues.length === 0 && (
        <p className="text-center text-gray-400">
          No issues have been resolved yet.
        </p>
      )}

      {/* ✅ Show cards */}
      {!loading && !error && issues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {issues.map(issue => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onViewDetails={() => navigate(`/issue/${issue._id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestResolvedIssues;

