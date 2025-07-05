import { useState, useEffect } from "react";
import {
  Card,
  Badge,
  Alert,
  Spinner,
  Button,
  TextInput,
  Label,
} from "flowbite-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axiosInstance from "../../lib/axios";

type Course = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  publishedAt: string;
  categories: Array<{ name: string }>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
  }>;
};

const AdminCoursesPage = () => {
  // Estados para autenticación
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("Admin123$");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminAuthToken");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchCourses();
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (email === "admin@admin.com" && password === "Admin123$") {
        // Usa el token guardado en localStorage o un token fijo
        const savedToken = localStorage.getItem("jwt") || "fake-jwt-token";
        localStorage.setItem("adminAuthToken", savedToken);
        setToken(savedToken);
        setIsAuthenticated(true);
        fetchCourses();
      } else {
        setAuthError("Credenciales inválidas. Intente nuevamente.");
      }
    } catch (err) {
      setAuthError("Error de autenticación. Verifique sus credenciales.");
      console.error("Login error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("adminAuthToken");
      if (!storedToken) throw new Error("No autenticado");

      const response = await axiosInstance.get("/courses?populate=*", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzUxNzUzOTQ1LCJleHAiOjE3NTQzNDU5NDV9.27CrQ2axkBX0KT3NsTK98rUGy9h1rMp8c1xxdKitmeY`,
          "Content-Type": "application/json",
        },
      });

      const coursesData = response.data.data.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        publishedAt: course.publishedAt,
        categories:
          course.categories?.map((cat: any) => ({
            name: cat.name,
          })) || [],
        users:
          course.users?.map((user: any) => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
          })) || [],
      }));
      setCourses(coursesData);
    } catch (err) {
      setError("Error al cargar cursos. Intente nuevamente.");
      console.error("Fetch courses error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    setIsAuthenticated(false);
    setCourses([]);
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

  // Generar PDF del curso
  const generateCoursePDF = async (course: Course) => {
    try {
      const doc = new jsPDF();

      // Título
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text(`Reporte del Curso: ${course.title}`, 15, 20);

      if (course.imageUrl) {
        try {
          const imgData = await getBase64ImageFromURL(course.imageUrl);
          doc.addImage(imgData, "JPEG", 15, 30, 50, 30);
        } catch (imgError) {
          console.error("Error al cargar la imagen:", imgError);
        }
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      course.categories.forEach((cat, index) => {
        doc.text(
          `Categoría: ${cat?.name || "Sin categoría"}`,
          70,
          40 + index * 5
        );
      });

      // Descripción
      doc.text(`Descripción:`, 15, 70);
      const splitDescription = doc.splitTextToSize(course.description, 180);
      doc.text(splitDescription, 15, 80);

      const usersCount = course.users?.length || 0;

      // Tabla usuarios inscritos
      if (usersCount > 0) {
        doc.text("Lista de Usuarios Inscritos:", 15, 140);

        const userData = course.users.map((user) => [
          user.id || "N/A",
          user.name || "Sin nombre",
          user.email || "Sin email",
        ]);

        autoTable(doc, {
          startY: 145,
          head: [["ID", "Nombre", "Email", "Rol"]],
          body: userData,
          theme: "grid",
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: "linebreak",
          },
          margin: { left: 15 },
          didDrawPage: (data) => {
            if (data.pageNumber === data.pageCount) {
              const finalY = data.cursor?.y || 145 + userData.length * 10;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.text(
                `Total de inscripciones: ${usersCount}`,
                15,
                finalY + 15
              );
            }
          },
        });
      } else {
        doc.setFont("helvetica", "bold");
        doc.text(`Total de inscripciones: ${usersCount}`, 15, 140);
      }

      // Pie de página con número y fecha
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

      doc.save(`reporte-curso-${course.title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("Error al generar el reporte PDF");
    } finally {
      setGeneratingPDF(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            Acceso Administrador
          </h1>
          {authError && (
            <Alert color="failure" className="mb-4">
              {authError}
            </Alert>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" value="Email Administrador" />
              <TextInput
                id="email"
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" value="Contraseña" />
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-400"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                "Acceder como Administrador"
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Reportes de Cursos (Admin)
        </h1>
        <div className="flex gap-4">
          <Button onClick={() => fetchCourses()} color="gray">
            Refrescar datos
          </Button>
          <Button onClick={handleLogout} color="failure">
            Cerrar Sesión
          </Button>
        </div>
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
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
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

                <div className="w-full md:w-3/4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {course.categories?.map((category, index) => (
                        <Badge key={index} color="info">
                          {category?.name || "Sin categoría"}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Creado:</span>{" "}
                        {new Date(course.publishedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Inscritos:</span>{" "}
                        {course.users?.length || 0}
                      </p>
                    </div>
                    <Button
                      onClick={() => generateCoursePDF(course)}
                      disabled={generatingPDF === course.id}
                      className="bg-blue-600 hover:bg-blue-700 4"
                      size="md"
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
