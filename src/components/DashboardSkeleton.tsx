import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-1 flex-col space-y-4 mt-4 p-6 border border-gray-200 bg-primary/60 rounded-lg shadow-lg animate-pulse">
      <div className="mb-4">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 w-72 bg-foreground/30 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Temperature skeleton */}
        <div className="bg-primary/60 p-2 rounded-lg">
          <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-foreground/30 mr-3"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Volume skeleton */}
        <div className="bg-primary/60 p-2 rounded-lg">
          <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-foreground/30 mr-3"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Status skeleton */}
        <div className="bg-primary/60 p-2 rounded-lg">
          <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-foreground/30 mr-3"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
