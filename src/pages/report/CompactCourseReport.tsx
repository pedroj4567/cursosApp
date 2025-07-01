import { useState, useEffect } from "react";
import {
  Card,
  Badge,
  Alert,
  Spinner,
  Button,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "flowbite-react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { reportServices } from "../../services/report.service";

type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

type Course = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  level: string;
  category: string;
  banner: string | null;
  users: User[];
};

const CompactCourseReport = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [authenticated, setAuthenticated] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    const initialize = async () => {
      try {
        await reportServices.authenticate();
        setAuthenticated(true);
        await fetchCourses();
      } catch (err) {
        setError("Error de autenticación o carga de datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchCourses();
    }
  }, [authenticated, currentPage]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportServices.getCoursesForReports(
        currentPage,
        pageSize
      );

      // Verificación adicional de la estructura de datos
      if (!Array.isArray(data)) {
        throw new Error("Formato de datos inesperado");
      }
      console.log(data);
      setCourses(data);

      // Si tu API devuelve metadatos de paginación:
      // setTotalPages(Math.ceil(data.meta.pagination.total / pageSize));
      // Por ahora usamos un valor por defecto
      setTotalPages(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  const generateCoursePDF = async (course: Course) => {
    setGeneratingPDF(course.id);
    try {
      const doc = new jsPDF();

      // Configuración básica del PDF
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`Reporte: ${course.title}`, 15, 20);

      // Información del curso
      doc.setFontSize(10);
      doc.text(`Categoría: ${course.category}`, 15, 30);
      doc.text(`Nivel: ${course.level}`, 15, 40);
      doc.text(`Inscritos: ${course.users.length}`, 15, 50);

      // Tabla de usuarios
      if (course.users.length > 0) {
        autoTable(doc, {
          startY: 60,
          head: [["Usuario", "Email", "Fecha"]],
          body: course.users.map((user) => [
            user.username,
            user.email,
            new Date(user.createdAt).toLocaleDateString(),
          ]),
          styles: { fontSize: 8 },
          margin: { top: 60 },
        });
      }

      doc.save(`reporte-${course.title}.pdf`);
    } catch (err) {
      setError("Error al generar PDF");
      console.error(err);
    } finally {
      setGeneratingPDF(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert color="failure">
          No autenticado. Por favor inicie sesión como administrador.
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reportes de Cursos</h1>
        <Button size="sm" onClick={fetchCourses}>
          Actualizar
        </Button>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg">
            {course.banner && (
              <img
                src={course.banner}
                alt={course.title}
                className="w-full h-32 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge color="info" size="xs">
                  {course.category}
                </Badge>
                <Badge
                  color={
                    course.level === "Avanzado"
                      ? "failure"
                      : course.level === "Intermedio"
                      ? "warning"
                      : "success"
                  }
                  size="xs"
                >
                  {course.level}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-800 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {course.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                {/* <span className="text-xs text-gray-500">
                  {course.users.length} inscritos
                </span> */}
                <Button
                  size="xl"
                  className="bg-blue-600"
                  onClick={() => generateCoursePDF(course)}
                  disabled={generatingPDF === course.id}
                >
                  {generatingPDF === course.id
                    ? "Generando..."
                    : "Descargar Reporte"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}
    </div>
  );
};

export default CompactCourseReport;
