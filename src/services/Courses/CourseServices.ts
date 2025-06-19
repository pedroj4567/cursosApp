/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../lib/axios";
import {
  Course,
  StrapiCourseResponse,
  fromJsonToCourse,
} from "../../pages/Courses/types";

export type CourseParam = {
  page?: number;
  size?: number;
};

export interface GetCourseByUUIDParams {
  uuid: string;
}

export const courseServices = {
  async getCoursesByPage(
    page: CourseParam["page"] = 1,
    size: CourseParam["size"] = 5
  ) {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axiosInstance.get(
        `/courses?populate[category][fields][0]=name&pagination[page]=${page}&pagination[pageSize]=${size}`,
        {
          headers: headers,
        }
      );

      if (response.status != 200) {
        throw new Error("Error al obtener los cursos");
      }

      const courses = response.data.data.map((values: StrapiCourseResponse) => {
        return fromJsonToCourse(values);
      });
      return courses;
    } catch (error) {
      console.error("Error en courseServices.getCourses:", error);
      throw error;
    }
  },

  async searchCourses(
    searchTerm: string = "",
    categorySlug: string | null = null,
    page: number = 1,
    pageSize: number = 6
  ) {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const params = new URLSearchParams();

      params.append("pagination[page]", page.toString());
      params.append("pagination[pageSize]", pageSize.toString());

      params.append("populate", "category");

      if (searchTerm) {
        params.append("filters[$or][0][title][$containsi]", searchTerm);
        params.append("filters[$or][1][description][$containsi]", searchTerm);
      }

      if (categorySlug) {
        params.append("filters[category][slug][$eq]", categorySlug.toString());
      }
      const response = await axiosInstance.get(
        `/courses?${params.toString()}`,
        {
          headers,
        }
      );

      return {
        data: response.data.data.map((element: any) => {
          return fromJsonToCourse(element);
        }),
        pagination: response.data.meta.pagination,
      };
    } catch (error) {
      console.error("Error al buscar cursos:", error);
      throw error;
    }
  },

  async getCourseByUUID({ uuid }: GetCourseByUUIDParams): Promise<Course> {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axiosInstance.get(
        `/courses?populate[0]=category&populate[1]=chapters&filters[documentId][$eq]=${uuid}`,
        {
          headers: headers,
        }
      );

      if (response.status != 200) {
        throw new Error("Error al obtener el curso");
      }

      return fromJsonToCourse(response.data.data[0]);
    } catch (error) {
      console.error("Error en courseServices.getCourses:", error);
      throw error; // Puedes manejar el error donde llames a este método
    }
  },

  async getCourseByDocumentId(uuid: string): Promise<Course> {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axiosInstance.get(
        `/courses?populate[0]=category&populate[1]=chapters&filters[documentId][$eq]=${uuid}`,
        {
          headers: headers,
        }
      );

      if (response.status !== 200 || !response.data.data.length) {
        throw new Error("Curso no encontrado");
      }

      return fromJsonToCourse(response.data.data[0]);
    } catch (error) {
      console.error("Error en courseServices.getCourseByDocumentId:", error);
      throw error;
    }
  },

  async getUserInSession() {
    const user = localStorage.getItem("user");

    if (user) {
      const userParsed = JSON.parse(user);

      const data = await axiosInstance.get(
        `/users/${userParsed.id}?populate=*`
      );
      return data.data;
    }
  },

  // Agrega esto a tu courseServices.ts
  async enrollToCourse(courseId: string | number): Promise<boolean> {
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

      // 1. Primero obtenemos los cursos actuales del usuario
      const currentUser = await axiosInstance.get(
        `/users/${userParsed.id}?populate[courses][fields][0]=id`,
        { headers }
      );

      const currentCourses =
        currentUser.data.courses?.map((c: any) => c.id) || [];

      // 2. Si el curso ya está asignado, retornamos true
      if (currentCourses.includes(courseId)) {
        return true;
      }

      // 3. Actualizamos el usuario con el nuevo curso
      await axiosInstance.put(
        `/users/${userParsed.id}`,
        {
          courses: [...currentCourses, courseId],
        },
        { headers }
      );

      return true;
    } catch (error) {
      console.error("Error en enrollToCourse:", error);
      throw new Error("No se pudo completar la inscripción");
    }
  },
};
