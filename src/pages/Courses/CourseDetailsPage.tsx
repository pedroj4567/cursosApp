import { Button } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseServices } from "../../services/Courses";
import { Spinner } from "flowbite-react";
import { Course } from "./types";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { getCourseByUUID } = courseServices;
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  console.log(course);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        const courseData = await getCourseByUUID({ uuid: id });
        setCourse(courseData);
      } catch (error) {
        console.error("Error al obtener el curso:", error);
      }
    };

    fetchCourse();
  }, [id, getCourseByUUID]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Banner del curso */}
      <div className="w-full h-64 md:h-80 overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      <section className="container mx-auto p-6">
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
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                >
                  {cat.name}
                </span>
              ))}
              <span className="text-teal-600 font-semibold">
                Horas: {course.hours}
              </span>
              <span className="text-gray-600">{course.lessons} lecciones</span>
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

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 transition-colors"
                onClick={() => {
                  // Lógica para inscribirse al curso
                }}
              >
                Inscribirse al curso
              </Button>

              <Button
                className="w-full mt-3 bg-white text-teal-600 border border-teal-600 hover:bg-teal-50 transition-colors"
                onClick={() => {
                  navigate(-1);
                }}
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
