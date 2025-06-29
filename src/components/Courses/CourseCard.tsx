import { Dropdown, DropdownItem } from "flowbite-react";
import { Course } from "../../pages/Courses/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";

export type CourseCardProps = {
  data: Course;
  onSeeLaterUpdate?: () => void;
};

const CourseCard = ({ data, onSeeLaterUpdate }: CourseCardProps) => {
  const {
    description,
    categories,
    duration,
    imageUrl,
    lessons,
    title,
    uuid,
    id,
  } = data;
  const [isInSeeLater, setIsInSeeLater] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useNavigate();

  const fetchSeeLaterCourses = async (): Promise<number[]> => {
    try {
      const token = localStorage.getItem("jwt");
      const user = localStorage.getItem("user");

      if (!token || !user) return [];

      const userParsed = JSON.parse(user);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axiosInstance.get(
        `/users/${userParsed.id}?populate[course_see_laters][fields][0]=id`,
        { headers }
      );
      console.log(response);
      return response.data.course_see_laters?.map((c: any) => c.id) || [];
    } catch (error) {
      console.error("Error al obtener cursos 'Ver más tarde':", error);
      toast.error("Error al cargar la lista de cursos");
      return [];
    }
  };

  const toggleSeeLater = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        throw new Error("Usuario no autenticado");
      }

      const userParsed = JSON.parse(user);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 1. Obtener la lista actual de cursos
      const currentSeeLaterCourses = await fetchSeeLaterCourses();
      const isCurrentlyInList = currentSeeLaterCourses.includes(id);

      // 2. Preparar la nueva lista
      let updatedCourses;
      if (isCurrentlyInList) {
        updatedCourses = currentSeeLaterCourses.filter(
          (courseId) => courseId !== id
        );
      } else {
        updatedCourses = [...currentSeeLaterCourses, id];
      }

      // 3. Actualizar el usuario con PUT
      await axiosInstance.put(
        `/users/${userParsed.id}`,
        {
          course_see_laters: updatedCourses,
        },
        { headers }
      );

      // 4. Actualizar estado local
      setIsInSeeLater(!isCurrentlyInList);
      toast.success(
        isCurrentlyInList
          ? "Curso removido de 'Ver más tarde'"
          : "Curso agregado a 'Ver más tarde'"
      );

      // 5. Notificar al componente padre si es necesario
      onSeeLaterUpdate?.();
    } catch (error) {
      console.error("Error al actualizar 'Ver más tarde':", error);
      toast.error("No se pudo actualizar la lista");
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar estado inicial al cargar
  useEffect(() => {
    const checkInitialStatus = async () => {
      setIsLoading(true);
      try {
        const seeLaterCourses = await fetchSeeLaterCourses();
        setIsInSeeLater(seeLaterCourses.includes(id));
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialStatus();
  }, [id]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="h-40 bg-gray-200 overflow-hidden relative">
        <img
          src={imageUrl || "/placeholder-course.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-course.jpg";
          }}
        />

        <button
          onClick={toggleSeeLater}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm ${
            isInSeeLater ? "text-red-500" : "text-gray-400"
          } hover:bg-white transition-colors`}
          aria-label={
            isInSeeLater ? "Quitar de ver más tarde" : "Agregar a ver más tarde"
          }
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill={isInSeeLater ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            {categories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {title}
            </h3>
          </div>
          <Dropdown
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                aria-label="Opciones del curso"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            )}
          >
            <DropdownItem
              onClick={() => navigator(`/course/${uuid}`)}
              className="text-blue-700 font-bold hover:bg-teal-50"
            >
              Ver detalles del curso
            </DropdownItem>
            <DropdownItem
              onClick={toggleSeeLater}
              disabled={isLoading}
              className={`flex items-center justify-between ${
                isInSeeLater ? "text-red-500" : "text-gray-700"
              } hover:bg-red-50`}
            >
              <span>
                {isInSeeLater
                  ? "Quitar de ver más tarde"
                  : "Agregar a ver más tarde"}
              </span>
              {isInSeeLater ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 fill-current text-red-500"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 stroke-current text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              )}
            </DropdownItem>
          </Dropdown>
        </div>

        <p className="text-gray-600 mt-2 mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            {lessons} lecciones
          </span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
