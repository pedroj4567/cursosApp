const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200 w-full"></div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-full w-full mt-2"></div>
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
            <div className="h-3 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
            <div className="h-3 bg-gray-200 rounded-full w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
