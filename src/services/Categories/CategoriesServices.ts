/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../lib/axios";

export const categoriesServices = {
  async getCategories() {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axiosInstance("/categories", {
        headers,
      });
      return response.data.data.map((element: any) => {
        return {
          id: element.id,
          name: element.name,
          uuid: element.documentId,
          slug: element.slug,
        };
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
