import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      {/* CSS Spinner */}
      <div className="w-24 h-24 border-8 border-red-500 border-t-transparent rounded-full animate-spin"></div>

      <h1 className="text-3xl font-bold text-red-500 text-center">
        You Are Forbidden to Access This Page
      </h1>

      <p className="text-lg text-gray-600 text-center">
        Please contact the administrator if you believe this is an error.
      </p>

      <div className="flex gap-4 mt-4">
        <Link to="/" className="btn btn-primary text-black">
          Go to Home
        </Link>
        <Link to="/dashboard" className="btn btn-secondary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
