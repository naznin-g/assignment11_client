import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundImg from "../../assets/error-404.png"; // rename here

const NotFound = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <img src={NotFoundImg} alt="Page Not Found" className="max-w-sm w-full mb-5" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops, Page Not Found!</h1>
      <p className="text-gray-600 text-center mb-5">
        The page you are looking for is not available.
      </p>
      <button
        onClick={handleGoBack}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
