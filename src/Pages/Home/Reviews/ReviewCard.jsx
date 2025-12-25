import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
    const { userName, review: testimonial } = review; // removed image

    return (
        <div className="max-w-sm bg-base-100 shadow-lg rounded-xl p-6 border border-gray-200">
            {/* Quote Icon */}
            <FaQuoteLeft className="text-primary text-2xl mb-4" />

            {/* Review Text */}
            <p className="mb-4 text-gray-700">{testimonial}</p>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300 my-4"></div>

            {/* User Name */}
            <div>
                <h3 className="font-semibold text-lg">{userName}</h3>
                <p className="text-sm text-gray-500">Verified User</p>
            </div>
        </div>
    );
};

export default ReviewCard;
