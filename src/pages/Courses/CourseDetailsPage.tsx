/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseServices } from "../../services/Courses";
import { Spinner } from "flowbite-react";
import { Course } from "./types";
import { HiArrowRight, HiCheck } from "react-icons/hi";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { getCourseByUUID, getUserInSession, enrollToCourse } = courseServices;
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const fetchCourseAndUser = async () => {
      if (!id) return;

      try {
        const courseData = await getCourseByUUID({ uuid: id });
        const userData = await getUserInSession();
        console.log(userData);

        setCourse(courseData);
        setUser(userData);

        // Verificar si el usuario ya está inscrito
        if (userData?.courses?.some((c: any) => c.id === courseData.id)) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchCourseAndUser();
  }, [id, getCourseByUUID, getUserInSession]);

  const handleEnroll = async () => {
    if (!course || !user) return;

    try {
      setLoadingEnroll(true);
      await enrollToCourse(course.id);
      setIsEnrolled(true);
      alert("¡Inscripción exitosa al curso!");
    } catch (error) {
      console.error("Error al inscribirse:", error);
      alert(error instanceof Error ? error.message : "Error al inscribirse");
    } finally {
      setLoadingEnroll(false);
    }
  };

  const handleGoToCourse = () => {
    if (course) {
      setNavigating(true);
      navigate(`/course/video/${course.uuid}`);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner
          aria-label="Cargando curso..."
          size="xl"
          color="gray"
          className="text-teal-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Logo UNERG como marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
        <img
          src="https://images.seeklogo.com/logo-png/26/2/unerg-logo-png_seeklogo-265623.png"
          alt="UNERG Logo"
          className="max-w-xs md:max-w-sm"
        />
      </div>

      {/* Banner del curso */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative z-10">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      <section className="container mx-auto p-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contenido principal */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {course.categories?.map((cat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {cat.name}
                </span>
              ))}
              <span className="text-blue-600 font-semibold">
                Horas: {course.hours}
              </span>
              <span className="text-gray-600 font-bold">
                {course.lessons} lecciones
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Descripción del curso
            </h2>
            <p className="text-gray-600 mb-6 whitespace-pre-line">
              {course.description}
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Capítulos del curso
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {course.chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className={`p-4 border-b ${
                    index === course.chapters.length - 1
                      ? ""
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-teal-600 font-medium mr-3">
                        {chapter.orden}
                      </span>
                      <div>
                        <h3 className="text-gray-800 font-medium">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {chapter.duration} hora{chapter.duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar con información del instructor */}
          <div className="md:w-80 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Instructor
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                  {course.profesor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-gray-800 font-medium">
                  {course.profesor}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Instructor especializado con amplia experiencia en el tema del
                curso.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
              {isEnrolled ? (
                <>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={handleGoToCourse}
                    disabled={navigating}
                  >
                    <HiArrowRight className="mr-2" />
                    {navigating ? "Cargando..." : "Ir al curso"}
                  </Button>
                  <Button
                    className="w-full bg-blue-100 text-teal-800 hover:bg-blue-200 transition-colors"
                    disabled
                  >
                    <HiCheck className="mr-2" />
                    Ya estás inscrito
                  </Button>
                </>
              ) : (
                <Button
                  disabled={loadingEnroll || !user}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={handleEnroll}
                >
                  {loadingEnroll
                    ? "Inscribiendo..."
                    : user
                    ? "Inscribirse al curso"
                    : "Inicia sesión para inscribirte"}
                </Button>
              )}

              <Button
                className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => navigate(-1)}
              >
                Volver a los cursos
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailsPage;
