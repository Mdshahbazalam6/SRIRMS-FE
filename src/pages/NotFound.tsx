import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Visual Element */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-gray-50 select-none leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black text-white px-4 py-1 rounded-lg rotate-3 font-mono text-sm shadow-xl">
              PAGE_NOT_FOUND
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 relative z-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Lost in the village?
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a
            new location. Don't worry, even the best navigators get lost
            sometimes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all active:scale-95 w-full sm:w-auto"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-black/10 active:scale-95 w-full sm:w-auto"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Think this is a mistake?{" "}
            <a
              href="#"
              className="text-black font-semibold underline underline-offset-4"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
