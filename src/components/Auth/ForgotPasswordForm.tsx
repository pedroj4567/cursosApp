// components/auth/ForgotPasswordForm.tsx
import { useState } from "react";
import { Button } from "flowbite-react";
import { AuthInput } from "./AuthInput";
import { validateEmail } from "../../helpers/validators";

type ForgotPasswordFormProps = {
  onModeChange: (mode: "login" | "register" | "forgot") => void;
};

export const ForgotPasswordForm = ({
  onModeChange,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    console.log("Solicitud de recuperación para:", email);
    setIsSubmitted(true);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 sm:space-y-4 md:space-y-6"
    >
      {isSubmitted ? (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-green-600 text-sm sm:text-base">
            ¡Enlace enviado! Revisa tu correo electrónico.
          </p>
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className="mt-3 text-cyan-600 hover:underline text-xs sm:text-sm"
          >
            Volver al inicio de sesión
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>

          <AuthInput
            label="Correo electrónico"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={error}
          />

          <Button
            type="submit"
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white"
          >
            Enviar instrucciones
          </Button>

          <button
            type="button"
            onClick={() => onModeChange("login")}
            className="text-xs sm:text-sm text-cyan-600 hover:underline w-full text-center mt-2"
          >
            Volver al inicio de sesión
          </button>
        </>
      )}
    </form>
  );
};
