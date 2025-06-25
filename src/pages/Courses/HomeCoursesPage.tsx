import { Button } from "flowbite-react";
import CourseCard from "../../components/Courses/CourseCard";
import CourseCardSkeleton from "../../components/Courses/CourseCardSkeleton"; // Importa el skeleton
import CourseFilters from "../../components/Courses/CourseFilter";
import { Course } from "./types";
import { useCourses } from "../../hooks/useCourses";
import { useNavigate } from "react-router-dom";

const HomeCoursesPage = () => {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();
  return (
    <div className="min-h-screen bg-gray-50">
      <CourseFilters />

      <section className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={`skeleton-${index}`} />
              ))
            : courses.map((course: Course) => (
                <CourseCard key={course.id} data={course} />
              ))}
        </div>

        <div className="my-5 flex justify-center">
          <Button
            className="bg-blue-600  hover:bg-teal-700 transition-colors px-10 py-2 cursor-pointer"
            onClick={() => {
              navigate("/search");
            }}
          >
            Ver más
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomeCoursesPage;
