import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CategorySection = () => {
  const specialties = [
    {
      title: "Inteligencia Artificial",
      courses: 18,
      icon: "🤖",
      color: "bg-purple-100 text-purple-800",
      description:
        "Domina Machine Learning, redes neuronales y sistemas inteligentes con nuestros cursos especializados",
    },
    {
      title: "Desarrollo Full Stack",
      courses: 24,
      icon: "💻",
      color: "bg-blue-100 text-blue-800",
      description:
        "Aprende a construir aplicaciones completas con las tecnologías más demandadas del mercado",
    },
    {
      title: "Ciberseguridad",
      courses: 15,
      icon: "🔐",
      color: "bg-red-100 text-red-800",
      description:
        "Conviértete en experto en protección de sistemas y ethical hacking con casos reales",
    },
    {
      title: "Cloud Computing",
      courses: 12,
      icon: "☁️",
      color: "bg-sky-100 text-sky-800",
      description:
        "Domina AWS, Azure y Google Cloud para implementar soluciones escalables",
    },
    {
      title: "Ciencia de Datos",
      courses: 20,
      icon: "📊",
      color: "bg-emerald-100 text-emerald-800",
      description:
        "Aprende análisis estadístico, visualización de datos y machine learning aplicado",
    },
    {
      title: "DevOps",
      courses: 14,
      icon: "🛠️",
      color: "bg-amber-100 text-amber-800",
      description:
        "Automatiza despliegues y gestiona infraestructura como código con herramientas modernas",
    },
    {
      title: "Blockchain",
      courses: 9,
      icon: "⛓️",
      color: "bg-indigo-100 text-indigo-800",
      description:
        "Desarrolla aplicaciones descentralizadas y smart contracts con Solidity y Ethereum",
    },
    {
      title: "Realidad Virtual",
      courses: 7,
      icon: "👓",
      color: "bg-pink-100 text-pink-800",
      description:
        "Crea experiencias inmersivas con Unity y Unreal Engine para diversos dispositivos",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % specialties.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, [specialties.length]);

  return (
    <section className="py-12  w-full mb-20">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
            Especialidades en Ingeniería de Sistemas
          </h2>
          <p className="text-gray-600">
            Enfoques profesionales para formar los ingenieros del futuro
          </p>
        </div>

        {/* Carrusel automático */}
        <div className="relative h-70 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex justify-center"
            >
              <div className="flex space-x-6 w-full max-w-4xl mx-auto ">
                {[
                  currentIndex,
                  (currentIndex + 1) % specialties.length,
                  (currentIndex + 2) % specialties.length,
                ].map((index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white rounded-xl p-6  shadow-xl border border-cyan-100 flex flex-col"
                  >
                    <div className="bg-cyan-600 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <div className={`text-2xl ${specialties[index].icon}`}>
                        {specialties[index].icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-cyan-800 mb-3">
                      {specialties[index].title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {specialties[index].description ||
                        `${specialties[index].courses} cursos disponibles`}
                    </p>
                    <button className="mt-auto text-cyan-600 hover:text-cyan-800 font-medium flex items-center self-start">
                      Ver más
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-6 space-x-2">
          {specialties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-cyan-600" : "bg-gray-300"
              }`}
              aria-label={`Ir a especialidad ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
