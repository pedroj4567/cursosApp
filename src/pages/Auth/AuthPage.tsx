import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "flowbite-react";

import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from "../../components/Auth";

const AuthPage = () => {
  const [authMode, setAuthMode] = useState("login");
  const [isAnimating, setIsAnimating] = useState(false);
  // Imagen de Pexels
  const pexelsImage =
    "https://images.pexels.com/photos/5554246/pexels-photo-5554246.jpeg";

  const handleModeChange = (newMode: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setAuthMode(newMode);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <motion.div
        className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-auto"
        initial={false}
        animate={{
          backgroundPosition: authMode === "login" ? "center" : "left center",
        }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pexelsImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br  bg-opacity-80" />

        <div className="relative h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: authMode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authMode === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="text-white text-center w-full max-w-xs sm:max-w-sm md:max-w-md"
            >
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 shadow-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-white drop-shadow-lg">
                  FrostAcademy
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-cyan-100 font-medium">
                  Plataforma Educativa
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 text-left">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  {authMode === "login"
                    ? "Accede a tus cursos y recursos educativos"
                    : authMode === "register"
                    ? "Únete a nuestra comunidad educativa"
                    : "Recupera tu acceso rápidamente"}
                </p>

                <ul className="space-y-1 sm:hidden sm:space-y-2 text-xs sm:text-sm md:text-base text-cyan-50">
                  {authMode === "login" ? (
                    <>
                      <li className="flex items-start">
                        <span className="mr-1 sm:mr-2">✓</span>
                        <span>Continúa tu aprendizaje</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 sm:mr-2">✓</span>
                        <span>Materiales exclusivos</span>
                      </li>
                    </>
                  ) : authMode === "register" ? (
                    <>
                      <li className="flex items-start">
                        <span className="mr-1 sm:mr-2">✓</span>
                        <span>Certificaciones reconocidas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 sm:mr-2">✓</span>
                        <span>Acceso ilimitado</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <span className="mr-1 sm:mr-2">✓</span>
                        <span>Enlace seguro por correo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 sm:mr-2">✓</span>
                        <span>Solución en minutos</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Lado derecho - Formularios */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, x: authMode === "login" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: authMode === "login" ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md"
          >
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                {authMode === "login"
                  ? "Bienvenido"
                  : authMode === "register"
                  ? "Registro"
                  : "Recuperar contraseña"}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                {authMode === "login"
                  ? "Ingresa tus credenciales"
                  : authMode === "register"
                  ? "Completa el formulario"
                  : "Ingresa tu correo electrónico"}
              </p>
            </div>

            {authMode === "login" && (
              <LoginForm onModeChange={handleModeChange} />
            )}

            {authMode === "register" && (
              <RegisterForm onModeChange={handleModeChange} />
            )}

            {authMode === "forgot" && (
              <ForgotPasswordForm onModeChange={handleModeChange} />
            )}

            <div className="mt-4 sm:mt-6 md:mt-8 text-center flex items-center  justify-center gap-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {authMode === "login"
                  ? "¿No tienes una cuenta?"
                  : authMode === "register"
                  ? "¿Ya tienes una cuenta?"
                  : ""}
              </p>
              {authMode !== "forgot" && (
                <Button
                  onClick={() =>
                    handleModeChange(
                      authMode === "login" ? "register" : "login"
                    )
                  }
                  disabled={isAnimating}
                  className=" bg-blue-500 hover:bg-blue-600  text-xs sm:text-sm px-4 sm:px-6 py-1 sm:py-2"
                >
                  {authMode === "login"
                    ? "Regístrate aquí"
                    : "Inicia sesión aquí"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
