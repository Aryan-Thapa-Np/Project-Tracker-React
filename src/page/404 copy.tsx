import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg w-full animate-fadeIn">
        <AlertCircle className="mx-auto mb-6 text-yellow-500 animate-bounce" size={60} />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          Oops! we are currently facing issues with our server plese try again later.  
          If you are the owner of this page, check the server logs to figure out the cause.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 cursor-pointer bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
