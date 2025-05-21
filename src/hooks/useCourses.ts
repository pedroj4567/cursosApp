import { useState, useEffect } from "react";
import { Course } from "../pages/Courses/types";
import { courseServices } from "../services/Courses";

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseServices.getCoursesByPage();
        setCourses(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Error al obtener cursos")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  return { courses, loading, error };
};
