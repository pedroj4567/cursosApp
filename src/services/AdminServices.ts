import axiosInstance from "../lib/axios";

const adminServices = {
  /**
   * Obtiene la lista de administradores paginada
   * @param page Número de página (por defecto 1)
   * @param size Tamaño de página (por defecto 5)
   * @returns Promise con array de administradores
   * @throws Error si no hay token o falla la petición
   */
  async getAdminsByPage(page: number = 1, size: number = 5) {
    try {
      // Obtener token de autenticación de administrador
      const token = localStorage.getItem("adminAuthToken");

      if (!token) {
        throw new Error(
          "No se encontró el token de autenticación de administrador"
        );
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Realizar la petición con los parámetros de paginación
      const response = await axiosInstance.get(
        `/admin-users?pagination[page]=${page}&pagination[pageSize]=${size}`,
        {
          headers: headers,
        }
      );

      if (response.status !== 200) {
        throw new Error("Error al obtener los administradores");
      }

      // Mapear la respuesta al formato de nuestro dominio
      const admins = response.data.data.map((adminData: any) => {
        return fromJsonToAdmin(adminData);
      });

      return admins;
    } catch (error) {
      console.error("Error en adminServices.getAdminsByPage:", error);
      throw error;
    }
  },

  /**
   * Autentica a un administrador
   * @param email Email del administrador
   * @param password Contraseña del administrador
   * @returns Promise con el token de autenticación
   * @throws Error si falla la autenticación
   */
  async loginAdmin(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/admin/auth/local", {
        identifier: email,
        password: password,
      });

      if (response.status !== 200) {
        throw new Error("Credenciales incorrectas");
      }

      // Guardar el token en localStorage
      localStorage.setItem("adminAuthToken", response.data.jwt);

      return response.data.jwt;
    } catch (error) {
      console.error("Error en adminServices.loginAdmin:", error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del administrador
   */
  logoutAdmin() {
    localStorage.removeItem("adminAuthToken");
  },

  /**
   * Verifica si hay un administrador autenticado
   * @returns boolean indicando si está autenticado
   */
  isAdminAuthenticated(): boolean {
    return !!localStorage.getItem("adminAuthToken");
  },
};

export default adminServices;
function fromJsonToAdmin(adminData: any) {
  throw new Error("Function not implemented.");
}
