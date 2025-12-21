import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

const StaffDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch assigned issues
  const { data: assignedIssues = [], isLoading: loadingIssues } = useQuery({
    queryKey: ['staff-assigned-issues'],
    queryFn: async () => {
      const res = await axiosSecure.get('/staff/issues/assigned');
      return res.data;
    },
  });

  // Fetch statistics for charts
  const { data: stats = [] } = useQuery({
    queryKey: ['staff-issue-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/staff/issues/stats');
      return res.data;
    },
  });

  if (loadingIssues) return <p>Loading...</p>;

  const getPieChartData = (data) => {
    return data.map((item) => ({ name: item.status, value: item.count }));
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6">Staff Dashboard</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat shadow p-4">
          <div className="stat-title">Total Assigned</div>
          <div className="stat-value">{assignedIssues.length}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Resolved Issues</div>
          <div className="stat-value">{stats.find(s => s.status === 'Resolved')?.count || 0}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">In-Progress</div>
          <div className="stat-value">{stats.find(s => s.status === 'In-Progress')?.count || 0}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Pending Issues</div>
          <div className="stat-value">{stats.find(s => s.status === 'Pending')?.count || 0}</div>
        </div>
      </div>

      {/* Assigned Issues Table */}
      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedIssues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
                <td>
                  <Link
                    to={`/staff/issue/${issue._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View / Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Pie Chart */}
      <div className="w-full md:w-1/2 mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-center">Issue Status Distribution</h3>
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={getPieChartData(stats)}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          />
          <Legend />
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default StaffDashboard;
