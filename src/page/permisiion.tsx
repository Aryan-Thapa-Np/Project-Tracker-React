import React from "react";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InsufficientPermissionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-10 text-center max-w-md w-full">
        <ShieldX className="mx-auto mb-4 text-red-600" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Insufficient Permissions</h1>
        <p className="text-gray-600 mb-6">
          You don’t have the required permissions to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition shadow"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default InsufficientPermissionPage;
