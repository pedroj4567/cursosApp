import {
  PlayIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { courseServices } from "../../services/Courses";

interface Chapter {
  id: number;
  documentId: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  orden: number;
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
  resources?: Array<{ name: string; type: string }>;
}

interface Category {
  name: string;
}

interface Course {
  id: number;
  uuid: string;
  title: string;
  description: string;
  duration: string;
  hours: number;
  lessons: string;
  profesor: string;
  imageUrl: string;
  categories: Category[];
  chapters: Chapter[];
  progress?: number;
}

const CoursePlayerPage = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) {
          throw new Error("No se proporcionó ID del curso");
        }

        const courseData = await courseServices.getCourseByDocumentId(id);

        // Añadir propiedades adicionales si no vienen de la API
        const enrichedCourse = {
          ...courseData,
          progress: courseData.progress || 0,
          chapters: courseData.chapters.map((chapter) => ({
            ...chapter,
            completed: chapter.completed || false,
            resources: chapter.resources || [],
          })),
        };

        setCourse(enrichedCourse);
      } catch (err) {
        console.error("Error al cargar el curso:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);
  console.log(course);
  if (!course?.chapters.length) {
    navigator(`/course/${id}`);
    return;
  }

  const convertToEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  if (loading) {
    return (
      <main className="bg-white min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Cargando curso...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-white min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="bg-white min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p>No se encontró el curso</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/courses"
                className="text-sm text-cyan-600 hover:text-cyan-800 inline-flex items-center"
              >
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Mis Cursos
              </Link>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 ml-1 md:ml-2 font-medium">
                  {course.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sección izquierda - Reproductor y contenido principal */}
          <div className="lg:w-2/3">
            {/* Reproductor de video */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6 shadow-md">
              {course.chapters[activeChapter]?.videoUrl && (
                <iframe
                  className="w-full h-full"
                  src={convertToEmbedUrl(
                    course.chapters[activeChapter].videoUrl
                  )}
                  title={`Video: ${course.chapters[activeChapter].title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Información del capítulo actual */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {course.chapters[activeChapter].title}
                </h2>
                <span className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
                  {course.chapters[activeChapter].duration} hora
                  {course.chapters[activeChapter].duration !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="prose max-w-none text-gray-600">
                <p>
                  {course.chapters[activeChapter].description ||
                    "Este capítulo no tiene descripción."}
                </p>
              </div>
            </div>

            {/* Recursos del capítulo */}
            {course.chapters[activeChapter].resources?.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-cyan-600 mr-2" />
                  Recursos del capítulo
                </h3>
                <ul className="space-y-3">
                  {course.chapters[activeChapter].resources?.map(
                    (resource, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-md shadow-xs border border-gray-100"
                      >
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-700">
                            {resource.name}
                          </span>
                        </div>
                        <button className="text-sm text-cyan-600 hover:text-cyan-800 font-medium">
                          Descargar
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Sección derecha - Lista de capítulos */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contenido del curso
                </h2>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">
                    {course.progress}% completado
                  </span>
                  <div className="ml-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {course.chapters
                  .sort((a, b) => a.orden - b.orden)
                  .map((chapter, index) => (
                    <li key={chapter.id}>
                      <button
                        onClick={() => setActiveChapter(index)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between ${
                          activeChapter === index
                            ? "bg-cyan-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          {chapter.completed ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                          ) : (
                            <PlayIcon className="h-5 w-5 text-gray-400 mr-3" />
                          )}
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                activeChapter === index
                                  ? "text-cyan-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {chapter.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {chapter.duration} hora
                              {chapter.duration !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        {activeChapter === index && (
                          <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full">
                            Reproduciendo
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Información del instructor */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sobre el instructor
              </h3>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium">
                    {course.profesor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-bold text-gray-900">
                    {course.profesor}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Instructor del curso
                  </p>
                </div>
              </div>
            </div>

            {/* Información del quiz */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz</h3>
              <div className="flex items-start">
                <div className="ml-4">
                  <p className="text-sm text-gray-500 mt-1">
                    Prueba tus nuevas habilidades
                  </p>
                  <div>
                    <Button
                      className="border text-teal-800 mx-auto px-4 py-1"
                      onClick={() => {
                        navigator(`/course/quiz/${id}`);
                      }}
                    >
                      Hacer Quiz
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoursePlayerPage;
