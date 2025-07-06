/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "flowbite-react";
import { AuthInput } from "./AuthInput";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../helpers/validators";
import { useAuth } from "../../hooks/useAuth";

type LoginFormProps = {
  onModeChange: (mode: string) => void;
};

export const LoginForm = ({ onModeChange }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || "",
        password: passwordError || "",
      });
      return;
    }

    setAuthError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/courses");
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        const strapiError = error.response.data.error.message.toLowerCase();

        if (
          strapiError.includes("identifier") ||
          strapiError.includes("email")
        ) {
          setErrors({
            ...errors,
            email: "Correo electrónico no registrado",
          });
        } else if (
          strapiError.includes("password") ||
          strapiError.includes("invalid")
        ) {
          setErrors({
            ...errors,
            password: "Contraseña incorrecta",
          });
        } else {
          setAuthError("Error al iniciar sesión. Intente nuevamente.");
        }
      } else {
        setAuthError(
          error.message ||
            "Error de credenciales. Por favor verifique las credenciales enviadas."
        );
      }
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
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (authError) setAuthError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 sm:space-y-4 md:space-y-6"
    >
      {authError && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
          {authError}
        </div>
      )}

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
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        name="password"
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-xs sm:text-sm text-gray-700"
          >
            Recordarme
          </label>
        </div>
        <button
          type="button"
          onClick={() => onModeChange("forgot")}
          className="text-xs sm:text-sm text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Ingresando...
          </span>
        ) : (
          "Ingresar"
        )}
      </Button>
    </form>
  );
};
