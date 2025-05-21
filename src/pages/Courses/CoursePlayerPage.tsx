import {
  PlayIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CoursePlayerPage = () => {
  const [activeChapter, setActiveChapter] = useState(0);

  // Datos de ejemplo - reemplaza con tus datos reales
  const course = {
    title: "Introducción a React Avanzado",
    description:
      "Aprende hooks avanzados, context API y patrones de diseño en React",
    instructor: "María García",
    thumbnail: "/images/react-course.jpg",
    progress: 65,
    chapters: [
      {
        id: 1,
        title: "Introducción al curso",
        duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // URL completa del embed
        completed: true,
        resources: [
          { name: "Guía de instalación.pdf", type: "pdf" },
          { name: "Código inicial.zip", type: "zip" },
        ],
      },
      {
        id: 2,
        title: "Configuración del entorno",
        duration: "22 min",
        videoUrl: "https://www.youtube.com/embed/c3THPu57CZM",
        completed: true,
        resources: [],
      },
    ],
  };

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
              <iframe
                className="w-full h-full"
                src={course.chapters[activeChapter].videoUrl}
                title={`Video: ${course.chapters[activeChapter].title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Información del capítulo actual */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {course.chapters[activeChapter].title}
                </h2>
                <span className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
                  {course.chapters[activeChapter].duration}
                </span>
              </div>

              <div className="prose max-w-none text-gray-600">
                <p>
                  Este capítulo cubre los conceptos fundamentales necesarios
                  para comenzar con el curso.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Introducción a los temas principales</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Requisitos previos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Configuración inicial</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Recursos del capítulo */}
            {course.chapters[activeChapter].resources.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-cyan-600 mr-2" />
                  Recursos del capítulo
                </h3>
                <ul className="space-y-3">
                  {course.chapters[activeChapter].resources.map(
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

              <ul className="divide-y divide-gray-200">
                {course.chapters.map((chapter, index) => (
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
                            {chapter.duration}
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
                    MG
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-bold text-gray-900">
                    {course.instructor}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Ingeniera Frontend con 8 años de experiencia
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Especializada en React, TypeScript y arquitectura de
                    aplicaciones escalables.
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
                    <Button className="border text-teal-800 mx-auto px-4 py-1">
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
