import { Spinner } from "flowbite-react";
import { Course } from "../../pages/Courses/types";
import Pagination from "./Pagination";
import CourseCard from "./CourseCard";

interface SearchResultsProps {
  courses: Course[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SearchResults = ({
  courses,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner
          aria-label="Cargando cursos..."
          className="text-gradient-to-r from-green-400 to-blue-500"
          size="xl"
          color="purple"
        />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          No se encontraron cursos
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Intenta con otros términos de búsqueda o filtros
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => {
          return <CourseCard key={course.id} data={course} />;
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default SearchResults;
