// src/Component/Timeline/Timeline.jsx
import React from 'react';

const Timeline = ({ entries = [] }) => {
  if (entries.length === 0) {
    return <p className="text-gray-500">No activity yet</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Issue Timeline</h3>

      <ul className="space-y-3">
        {entries.map((item, index) => (
          <li key={index} className="border-l-4 pl-4 border-blue-500">
            <p className="font-medium capitalize">
              {item.status.replace(/_/g, ' ')}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
