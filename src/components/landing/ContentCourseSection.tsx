const ContentCourseSection = () => {
  return (
    <section className="bg-white w-full pt-24 pb-24 ">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-cyan-800 mb-12">
          Nuestros Programas Destacados
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cards de cursos */}
          <div className="bg-white rounded-xl p-6 shadow-xl border border-cyan-100">
            <div className="bg-cyan-600 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cyan-800 mb-3">
              Desarrollo Full Stack
            </h3>
            <p className="text-gray-600 mb-4">
              Domina las tecnologías más demandadas del mercado laboral actual
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl border border-cyan-100">
            <div className="bg-teal-500 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cyan-800 mb-3">
              Ciencia de Datos
            </h3>
            <p className="text-gray-600 mb-4">
              Aprende a extraer insights valiosos de grandes volúmenes de datos
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl border border-cyan-100">
            <div className="bg-emerald-400 text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cyan-800 mb-3">
              Diseño UX/UI
            </h3>
            <p className="text-gray-600 mb-4">
              Crea experiencias digitales memorables y centradas en el usuario
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentCourseSection;
