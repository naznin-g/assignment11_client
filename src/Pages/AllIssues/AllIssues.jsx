import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import IssueCard from '../IssueCard/IssueCard';
import  useAuth  from '../../hooks/useAuth';

const AllIssues = () => {
    const { user, isLoggedIn } = useAuth();
    const [filters, setFilters] = useState({ status: 'all', category: 'all', priority: 'all', search: '' });

    const { data: issues = [], refetch } = useQuery(['issues', filters], async () => {
        const res = await axios.get('/issues', { params: filters });
        return res.data;
    });

    const handleUpvote = async (issueId) => {
        if (!isLoggedIn) return; // safeguard
        try {
            await axios.post(`/issues/${issueId}/upvote`, { userEmail: user.email });
            refetch(); // update UI instantly
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to upvote', 'error');
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl mb-4">All Issues</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="select select-bordered">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>

                <select name="category" value={filters.category} onChange={handleFilterChange} className="select select-bordered">
                    <option value="all">All Categories</option>
                    <option value="streetlight">Streetlight</option>
                    <option value="pothole">Pothole</option>
                    <option value="water-leak">Water Leakage</option>
                    <option value="garbage">Garbage Overflow</option>
                    <option value="footpath">Damaged Footpath</option>
                    <option value="other">Other</option>
                </select>

                <select name="priority" value={filters.priority} onChange={handleFilterChange} className="select select-bordered">
                    <option value="all">All Priorities</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>

                <input
                    type="text"
                    name="search"
                    placeholder="Search issues..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="input input-bordered"
                />
            </div>

            {/* Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issues.length ? (
                    issues.map(issue => (
                        <IssueCard
                            key={issue._id}
                            issue={issue}
                            isLoggedIn={isLoggedIn}
                            currentUserEmail={user?.email}
                            onUpvote={handleUpvote}
                        />
                    ))
                ) : (
                    <p>No issues found.</p>
                )}
            </div>
        </div>
    );
};

export default AllIssues;

