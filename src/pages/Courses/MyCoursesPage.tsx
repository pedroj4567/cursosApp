import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import CourseCard from "../../components/Courses/CourseCard";
import { Link } from "react-router-dom";
import { Course, StrapiCourseResponse, fromJsonToCourse } from "./types";
import { Spinner } from "flowbite-react";
import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { courseServices } from "../../services/Courses";

const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getUserInSession } = courseServices;

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        // TODO: Reemplazar con tu llamada API real
        // const response = await api.get(`/users/${user?.id}/courses`);
        const user = await getUserInSession();
        const jsonCourses = user?.courses.map(
          (course: StrapiCourseResponse) => {
            return fromJsonToCourse(course);
          }
        );
        setCourses(jsonCourses);
      } catch (err) {
        setError("No se pudieron cargar tus cursos. Intenta recargar.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner className="text-teal-500" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium flex items-center"
              >
                Recargar página <ArrowRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con fondo blanco y borde inferior */}
        <div className="pb-6 mb-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Cursos</h1>
              <p className="mt-2 text-gray-600">
                {courses.length > 0
                  ? `Tienes ${courses.length} cursos en progreso`
                  : "Aún no tienes cursos asignados"}
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-800"
            >
              Explorar más cursos <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Contenido principal */}
        {courses.length > 0 ? (
          <div className="space-y-6">
            {/* Sección de cursos en progreso */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-5 w-5 text-cyan-600 mr-2" />
                Cursos en progreso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} data={course} />
                ))}
              </div>
            </div>

            {/* Sección de recientes */}
            <div className="pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 text-cyan-600 mr-2" />
                Recientemente vistos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* {courses
                  .sort(
                    (a, b) =>
                      new Date(b.lastAccessed).getTime() -
                      new Date(a.lastAccessed).getTime()
                  )
                  .slice(0, 2)
                  .map((course) => (
                    <CourseCard
                      key={`recent-${course.id}`}
                      data={course}
                      variant="horizontal"
                      className="h-40"
                    />
                  ))} */}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-gray-50 rounded-lg">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes cursos asignados
            </h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Explora nuestro catálogo y comienza tu aprendizaje hoy mismo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
