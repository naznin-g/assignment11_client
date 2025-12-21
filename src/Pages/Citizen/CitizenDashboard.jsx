import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

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
        <div className="p-8">
            <h2 className="text-3xl mb-4">Citizen Dashboard</h2>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="stat-card">Total Issues: {stats.total || 0}</div>
                <div className="stat-card">Pending: {stats.pending || 0}</div>
                <div className="stat-card">In-Progress: {stats.inProgress || 0}</div>
                <div className="stat-card">Resolved: {stats.resolved || 0}</div>
                <div className="stat-card">Total Payments: {stats.payments || 0} tk</div>
            </div>

            {/* Pie chart for issue status */}
            <div className="mb-6">
                <PieChart width={400} height={300}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/dashboard/my-issues" className="btn btn-primary">My Issues</Link>
                <Link to="/dashboard/report-issue" className="btn btn-secondary">Report Issue</Link>
                <Link to="/dashboard/profile" className="btn btn-accent">Profile</Link>
            </div>
        </div>
    );
};

export default CitizenDashboard;
