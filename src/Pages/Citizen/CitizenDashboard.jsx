import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CitizenDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ['citizen-dashboard-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/citizen/dashboard-stats');
      return res.data;
    }
  });

  const chartData = [
    { name: 'Pending', value: stats.pending || 0 },
    { name: 'In-Progress', value: stats.inProgress || 0 },
    { name: 'Resolved', value: stats.resolved || 0 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Citizen Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-base-200 p-4 shadow">Total Issues: {stats.total || 0}</div>
        <div className="card bg-base-200 p-4 shadow">Pending: {stats.pending || 0}</div>
        <div className="card bg-base-200 p-4 shadow">In-Progress: {stats.inProgress || 0}</div>
        <div className="card bg-base-200 p-4 shadow">Resolved: {stats.resolved || 0}</div>
        <div className="card bg-base-200 p-4 shadow">Total Payments: {stats.payments || 0} tk</div>
      </div>

      {/* Pie Chart */}
      <div className="mb-10">
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="my-issues" className="btn btn-primary">My Issues</Link>
        <Link to="report-issue" className="btn btn-secondary">Report Issue</Link>
        <Link to="profile" className="btn btn-accent">Profile</Link>
      </div>
    </div>
  );
};

export default CitizenDashboard;
