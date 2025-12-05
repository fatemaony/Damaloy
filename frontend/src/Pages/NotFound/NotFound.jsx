import React from 'react';
import { Link } from 'react-router';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] py-10 flex items-center justify-center bg-base-100 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-bold text-primary opacity-20 font-aladin">404</h1>

        <h2 className="text-4xl font-bold text-secondary -mt-5 mb-4 relative z-10">
          Page Not Found
        </h2>

        <p className="py-6 text-lg text-gray-500">
          Oops! The page you are looking for seems to have gone on an adventure without us.
          It might have been removed, renamed, or possibly never existed.
        </p>

        <Link to="/" className="btn btn-primary btn-lg gap-2 shadow-lg hover:scale-105 transition-transform">
          <FiHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
