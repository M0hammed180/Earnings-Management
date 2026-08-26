import React from "react";

export default function Loading({ className = "" }) {
  return (
    <div className={`h-screen w-full p-3 sm:p-4 ${className}`.trim()}>
      <div className="relative flex h-full items-center justify-center overflow-y-auto p-4 text-gray-800">
        <div className="flex items-center justify-center p-5">
          <div className="flex space-x-2 animate-pulse">
            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
