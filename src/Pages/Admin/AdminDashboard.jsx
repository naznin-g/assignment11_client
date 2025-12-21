import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch issue stats
  const { data: issueStats = [], isLoading: loadingIssues } = useQuery({
    queryKey: ['admin-issue-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/issues/stats');
      return res.data;
    },
  });

  // Fetch payment stats
  const { data: paymentStats = {}, isLoading: loadingPayments } = useQuery({
    queryKey: ['admin-payment-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/payments/stats');
      return res.data; // { totalPayments: 100000, totalTransactions: 250, pendingPayments: 5 }
    },
  });

  if (loadingIssues || loadingPayments) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6">Admin Dashboard</h2>

      {/* Issue Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat shadow p-4">
          <div className="stat-title">Total Issues</div>
          <div className="stat-value">{issueStats.total || 0}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Resolved Issues</div>
          <div className="stat-value">{issueStats.resolved || 0}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Pending Issues</div>
          <div className="stat-value">{issueStats.pending || 0}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Rejected Issues</div>
          <div className="stat-value">{issueStats.rejected || 0}</div>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="stat shadow p-4">
          <div className="stat-title">Total Payments Received</div>
          <div className="stat-value">{paymentStats.totalPayments || 0} Tk</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Total Transactions</div>
          <div className="stat-value">{paymentStats.totalTransactions || 0}</div>
        </div>
        <div className="stat shadow p-4">
          <div className="stat-title">Pending Payments</div>
          <div className="stat-value">{paymentStats.pendingPayments || 0}</div>
        </div>
      </div>

      {/* Placeholder for latest items (issues, payments, users) */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Latest Issues</h3>
        <p>Display a table of latest issues here</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Latest Payments</h3>
        <p>Display a table of latest payments here</p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2">Latest Users</h3>
        <p>Display a table of latest registered users here</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
