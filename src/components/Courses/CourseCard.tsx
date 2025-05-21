import { Dropdown, DropdownItem } from "flowbite-react";
import { Course } from "../../pages/Courses/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type CourseCardProps = {
  data: Course;
};

const CourseCard = ({ data }: CourseCardProps) => {
  const { description, categories, duration, imageUrl, lessons, title, uuid } =
    data;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const navigator = useNavigate();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            {categories.length > 0 &&
              categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-semibold mr-1 mb-1"
                >
                  {category.name}
                </span>
              ))}
            <h3 className="text-xl font-bold text-gray-800 mt-2">{title}</h3>
          </div>
          <Dropdown
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
              className="text-teal-700 font-bold hover:bg-teal-50"
            >
              Ver curso
            </DropdownItem>
            <DropdownItem
              onClick={toggleFavorite}
              className="flex items-center justify-between hover:bg-red-50"
            >
              <span>
                {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-2 transition-all duration-300 ${
                  isFavorite
                    ? "text-red-500 fill-current scale-110"
                    : isHeartHovered
                    ? "text-red-300 scale-110"
                    : "text-gray-300"
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isFavorite ? 0 : 2}
                fill={isFavorite ? "currentColor" : "none"}
                onMouseEnter={() => setIsHeartHovered(true)}
                onMouseLeave={() => setIsHeartHovered(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </DropdownItem>
          </Dropdown>
        </div>

        <p className="text-gray-600 mt-3 line-clamp-2">{description}</p>

        <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
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
            {lessons}
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
