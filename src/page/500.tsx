import React from "react";
import { useNavigate } from "react-router-dom";
import { ServerCrash } from "lucide-react";

const InternalServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg w-full animate-fadeIn">
        <ServerCrash className="mx-auto mb-6 text-red-500 animate-pulse" size={60} />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Internal Server Error</h2>
        <p className="text-gray-500 mb-8">
          Oops! Something went wrong on our end. Please try again later.  
          If the issue persists, contact our support team or check the server logs for details.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 cursor-pointer bg-red-600 text-white font-medium rounded-lg shadow-lg hover:bg-red-700 transition-all duration-200"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default InternalServerError;
