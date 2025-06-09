import React from "react";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Loading..." }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      <span className="ml-2 font-medium text-blue-600">{message}</span>
    </div>
  );
};

export default LoadingOverlay;
