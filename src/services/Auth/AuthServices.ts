/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../../lib/axios";
import { LoginRequest, SingUpRequest } from "./types";

const authServices = {
  async login({ email, password }: LoginRequest) {
    try {
      console.log("Debug", email);
      console.log("Debug", password);

      const response = await axios.post("/auth/local", {
        identifier: email,
        password,
      });

      if (response.data.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Error al iniciar sesión";
    }
  },

  async register(userData: SingUpRequest) {
    try {
      const registerResponse = await axios.post("/auth/local/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });

      return {
        jwt: registerResponse.data.jwt,
        user: registerResponse.data.user,
      };
    } catch (error: any) {
      let errorMessage = "Error al registrarse";

      if (error.response) {
        const strapiError = error.response.data.error.message.toLowerCase();

        if (strapiError.includes("email")) {
          errorMessage = "El correo electrónico ya está registrado";
        } else if (strapiError.includes("username")) {
          errorMessage = "El nombre de usuario ya está en uso";
        } else if (strapiError.includes("password")) {
          errorMessage = "La contraseña no cumple los requisitos";
        }
      }

      throw new Error(errorMessage);
    }
  },

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("jwt");
  },
};

export { authServices };
