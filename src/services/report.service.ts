import axiosInstance from "../lib/axios";

const HARDCODED_AUTH = {
  email: "admin@admin.com",
  password: "admin123$",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzUxMzc3Mzc2LCJleHAiOjE3NTM5NjkzNzZ9.DSiDAQEcsdiOULSfD9vXun9WHwb5MwnnVqkF-08J1LY",
};

export const reportServices = {
  async authenticate() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("jwt", HARDCODED_AUTH.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 8,
            email: HARDCODED_AUTH.email,
            role: "admin",
          })
        );
        resolve({
          token: HARDCODED_AUTH.token,
          user: {
            id: 8,
            email: HARDCODED_AUTH.email,
          },
        });
      }, 500);
    });
  },

  async getCoursesForReports(page: number = 1, pageSize: number = 10) {
    try {
      const headers = {
        Authorization: `Bearer ${HARDCODED_AUTH.token}`,
        "Content-Type": "application/json",
      };

      const response = await axiosInstance.get("/courses", {
        headers,
        params: {
          pagination: page,
          "pagination[pageSize]": pageSize,
        },
      });

      // Procesamiento seguro de la respuesta
      if (!response.data?.data) {
        throw new Error("Formato de respuesta inesperado");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error en reportServices.getCoursesForReports:", error);
      throw new Error("Error al cargar cursos. Intente nuevamente.");
    }
  },
};
