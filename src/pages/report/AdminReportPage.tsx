import React, { useState } from "react";
import * as XLSX from "xlsx";

const AdminReportPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    users: [],
    courses: [],
  });

  // Datos de ejemplo (reemplazar con llamadas API reales)
  const mockUsers = [
    { id: 1, name: "Usuario 1", email: "usuario1@test.com", role: "admin" },
    { id: 2, name: "Usuario 2", email: "usuario2@test.com", role: "user" },
  ];

  const mockCourses = [
    { id: 1, title: "Curso React", students: 25, duration: "4 semanas" },
    { id: 2, title: "Curso Node.js", students: 18, duration: "6 semanas" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulación de login (reemplazar con API real)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@test.com" && password === "admin123") {
        const mockToken = "mock-token-123456";
        setToken(mockToken);
        localStorage.setItem("authToken", mockToken);
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (endpoint) => {
    // Simulación de API (reemplazar con llamadas reales)
    console.log(`Fetching ${endpoint} with token: ${token}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (endpoint === "users") return mockUsers;
    if (endpoint === "courses") return mockCourses;
    return [];
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const [users, courses] = await Promise.all([
        fetchData("users"),
        fetchData("courses"),
      ]);

      setReportData({ users, courses });

      // Crear libro de Excel
      const workbook = XLSX.utils.book_new();

      // Hoja de usuarios
      const userWorksheet = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(workbook, userWorksheet, "Usuarios");

      // Hoja de cursos
      const courseWorksheet = XLSX.utils.json_to_sheet(courses);
      XLSX.utils.book_append_sheet(workbook, courseWorksheet, "Cursos");

      // Generar archivo
      XLSX.writeFile(workbook, "Reporte_Admin.xlsx");
    } catch (err) {
      setError("Error generando reporte");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("authToken");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Generar Reportes</h2>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Datos disponibles:</h3>
              <ul className="list-disc pl-5">
                <li>Usuarios: {reportData.users.length} registros</li>
                <li>Cursos: {reportData.courses.length} registros</li>
              </ul>
            </div>

            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
            >
              {loading ? (
                <span>Generando...</span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Descargar Reporte (Excel)
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReportPage;
