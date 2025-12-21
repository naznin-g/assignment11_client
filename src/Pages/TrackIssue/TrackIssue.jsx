import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const TrackIssue = () => {
    const [trackingId, setTrackingId] = useState('');
    const [issue, setIssue] = useState(null);
    const axiosSecure = useAxiosSecure();

    const handleTrack = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosSecure.get(`/issues/track/${trackingId}`);
            if (res.data) {
                setIssue(res.data);
            } else {
                Swal.fire('Not Found', 'No issue found with this tracking ID', 'warning');
                setIssue(null);
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to fetch issue. Try again.', 'error');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Track Your Issue</h2>
            <form onSubmit={handleTrack} className="mb-6">
                <input
                    type="text"
                    placeholder="Enter tracking ID"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="input input-bordered w-full mb-2"
                    required
                />
                <button type="submit" className="btn btn-primary w-full">Track Issue</button>
            </form>

            {issue && (
                <div className="card p-4 bg-base-100 shadow-md">
                    <h3 className="text-xl font-bold mb-2">{issue.title}</h3>
                    <p>Status: <strong>{issue.status}</strong></p>
                    <p>Category: {issue.category}</p>
                    <p>Location: {issue.location}</p>
                    <p>Priority: {issue.priority}</p>
                    {issue.assignedStaff && <p>Assigned Staff: {issue.assignedStaff.name}</p>}
                </div>
            )}
        </div>
    );
};

export default TrackIssue;
