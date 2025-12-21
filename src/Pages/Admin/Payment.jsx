import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

const Payments = () => {
  const axiosSecure = useAxiosSecure();
  const [filterMonth, setFilterMonth] = useState('all');

  // Fetch payments
  const { data: payments = [], refetch } = useQuery({
    queryKey: ['payments', filterMonth],
    queryFn: async () => {
      let url = '/admin/payments';
      if (filterMonth !== 'all') url += `?month=${filterMonth}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  // Optional: Prepare data for chart
  const chartData = payments.reduce((acc, payment) => {
    const month = new Date(payment.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.value += payment.amount;
    } else {
      acc.push({ name: month, value: payment.amount });
    }
    return acc;
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>

      {/* Filter by month */}
      <div className="mb-4">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="select select-bordered"
        >
          <option value="all">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          {/* Add remaining months */}
        </select>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.transactionId}</td>
                <td>{payment.userName}</td>
                <td>{payment.amount} Tk</td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Payments chart */}
      {chartData.length > 0 && (
        <div className="w-full md:w-1/2 mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-center">Payments by Month</h3>
          <PieChart width={400} height={300}>
            <Pie
              dataKey="value"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default Payments;
