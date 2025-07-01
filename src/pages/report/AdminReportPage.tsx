import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Alert,
  Spinner,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
  Button,
} from "flowbite-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Course } from "../../pages/Courses/types";
import { courseServices } from "../../services/Courses";

const ReportsPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos el servicio getCoursesByPage con parámetros por defecto
      const coursesData = await courseServices.getCoursesByPage(1, 10);
      setCourses(coursesData);
    } catch (err) {
      setError("Error al cargar los cursos. Intente nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBase64ImageFromURL = async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL);
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const generateCoursePDF = async (course: Course) => {
    setGeneratingPDF(course.id);
    try {
      const doc = new jsPDF();

      // Configuración inicial
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text(`Reporte del Curso: ${course.title}`, 15, 20);

      // Agregar imagen si existe (ajusta según la estructura de tu Course)
      if (course.imageUrl) {
        try {
          const imgData = await getBase64ImageFromURL(course.imageUrl);
          doc.addImage(imgData, "JPEG", 15, 30, 50, 30);
        } catch (imgError) {
          console.error("Error al cargar la imagen:", imgError);
        }
      }

      // Información básica del curso
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      // doc.text(
      //   `Categoría: ${course.category?.name || "Sin categoría"}`,
      //   70,
      //   40
      // );
      doc.text(`Descripción:`, 15, 70);

      // Dividir la descripción en líneas
      const splitDescription = doc.splitTextToSize(course.description, 180);
      doc.text(splitDescription, 15, 80);

      // Usuarios inscritos (necesitarías ajustar según tu modelo)
      doc.setFont("helvetica", "bold");
      // doc.text(
      //   `Total de inscripciones: ${course.enrollmentsCount || 0}`,
      //   15,
      //   120
      // );

      // Aquí podrías agregar más información específica de tu modelo Course

      // Pie de página
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${pageCount}`,
          180,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
        doc.text(
          `Generado el: ${new Date().toLocaleDateString()}`,
          15,
          doc.internal.pageSize.height - 10
        );
      }

      // Guardar el PDF
      doc.save(`reporte-curso-${course.title}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("Error al generar el reporte PDF");
    } finally {
      setGeneratingPDF(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes de Cursos</h1>
        <Button onClick={() => fetchCourses()} color="gray">
          Refrescar datos
        </Button>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {loading && !courses.length ? (
        <div className="text-center py-12">
          <Spinner size="xl" />
          <p className="mt-4">Cargando cursos...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="w-full md:w-3/4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color="info">
                      {course.category?.name || "Sin categoría"}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Creado:</span>{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Actualizado:</span>{" "}
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => generateCoursePDF(course)}
                      disabled={generatingPDF === course.id}
                    >
                      {generatingPDF === course.id ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Generando...
                        </>
                      ) : (
                        "Descargar Reporte"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                className="bg-blue-500"
                onClick={() => {
                  generateCoursePDF(course);
                }}
              >
                Descargar Reporte
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
