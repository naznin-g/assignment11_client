// src/Pages/About/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Our Platform</h1>

      <p className="mb-4 text-gray-700">
        The Public Infrastructure Issue Reporting System is a digital platform
        that allows citizens to report real-world issues such as broken streetlights,
        potholes, water leakage, garbage overflow, damaged footpaths, and more.
      </p>

      <p className="mb-4 text-gray-700">
        Government staff and admins can manage, verify, assign, and resolve reported
        issues efficiently. This platform improves transparency, reduces response time,
        and ensures a smoother communication between citizens and municipal services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
      <p className="text-gray-700">
        To create a transparent, efficient, and accountable system for reporting
        and resolving public infrastructure issues, empowering citizens and
        improving community well-being.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Features</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Report issues with images and detailed descriptions</li>
        <li>Track progress of reported issues in real-time</li>
        <li>Upvote and prioritize issues</li>
        <li>Staff assignment and admin verification</li>
        <li>Secure payments for issue boosting (if applicable)</li>
      </ul>
    </div>
  );
};

export default About;
