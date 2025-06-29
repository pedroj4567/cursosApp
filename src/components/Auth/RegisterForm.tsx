/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/auth/RegisterForm.tsx
import { useState } from "react";
import { Button } from "flowbite-react";
import { AuthInput } from "./AuthInput";
import { authServices } from "../../services"; // Importa el servicio de autenticación
import { useNavigate } from "react-router-dom";

type RegisterFormProps = {
  onModeChange: (mode: "login" | "register" | "forgot") => void;
};

export const RegisterForm = ({ onModeChange }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones previas...

    setIsLoading(true);

    try {
      // Opción 1: Solo registro
      // await authServices.register({
      //   username: formData.username,
      //   email: formData.email,
      //   password: formData.password,
      // });

      // Opción 2: Registro + login automático (recomendado)
      const { jwt, user } = await authServices.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Guardar en localStorage/contexto/estado global
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirigir al dashboard o página principal
      navigate("/courses");
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (isRegistered) {
    return (
      <div className="text-center space-y-6 p-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-green-800">
            ¡Registro exitoso!
          </h3>
          <p className="mt-1 text-sm text-green-600">
            Por favor verifica tu correo electrónico para activar tu cuenta.
          </p>
        </div>
        <Button
          onClick={() => onModeChange("login")}
          className="w-full bg-teal-500 hover:bg-teal-600"
        >
          Ir a Inicio de Sesión
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-3 sm:space-y-4 md:space-y-6"
      onSubmit={handleSubmit}
    >
      {errors.general && (
        <div className="p-2 text-red-500 text-sm bg-red-50 rounded text-center">
          {errors.general}
        </div>
      )}

      <AuthInput
        label="Nombre de usuario"
        type="text"
        placeholder="nombreusuario"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        name="username"
      />

      <AuthInput
        label="Correo electrónico"
        type="email"
        placeholder="tucorreo@ejemplo.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        name="email"
      />

      <AuthInput
        label="Confirmar correo"
        type="email"
        placeholder="Confirma tu correo"
        value={formData.confirmEmail}
        onChange={handleChange}
        error={errors.confirmEmail}
        name="confirmEmail"
      />

      <AuthInput
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        name="password"
      />

      <AuthInput
        label="Confirmar Contraseña"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        name="confirmPassword"
      />

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-cyan-300"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-light text-gray-700">
            Acepto los{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              términos y condiciones
            </a>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2"
        disabled={isLoading}
      >
        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>

      {/* <div className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes una cuenta?{" "}
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="font-medium text-blue-600 hover:underline"
        >
          Inicia Sesión
        </button>
      </div> */}
    </form>
  );
};
