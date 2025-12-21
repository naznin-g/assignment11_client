import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const IssueCard = ({ issue, isLoggedIn, currentUserEmail, onUpvote }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (!isLoggedIn) {
            Swal.fire('Login Required', 'Please login to view details', 'info').then(() => {
                navigate('/login', { state: { from: `/issue/${issue._id}` } });
            });
        } else {
            navigate(`/issue/${issue._id}`);
        }
    };

    return (
        <div className={`card shadow-md p-4 bg-base-100 border ${issue.boosted ? 'border-yellow-400' : 'border-gray-200'}`}>
            <img src={issue.image} alt={issue.title} className="mb-2 rounded" />
            <h3 className="text-xl font-bold">{issue.title}</h3>
            <p className="text-sm text-gray-500">{issue.category}</p>
            <p className={`text-sm font-medium ${issue.status === 'resolved' ? 'text-green-600' : 'text-gray-600'}`}>
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
            </p>
            <p className={`inline-block px-2 py-1 mt-1 text-xs font-semibold rounded ${issue.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
            </p>
            <p className="text-sm mt-1">{issue.location}</p>
            <div className="mt-2 flex items-center justify-between">
                <button
                    onClick={() => onUpvote(issue._id)}
                    disabled={!isLoggedIn || currentUserEmail === issue.creatorEmail || issue.upvotedBy?.includes(currentUserEmail)}
                    className="btn btn-sm btn-outline"
                >
                    👍 {issue.upvotes || 0}
                </button>
                <button onClick={handleViewDetails} className="btn btn-sm btn-primary">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default IssueCard;
