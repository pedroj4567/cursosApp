import FeatureItem from "./heroElements/FeatureItem";

const AboutProjectSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Fondo sutil con textura */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 to-cyan-100/30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black-800 mb-4">
            Plataforma Especializada en Contenido Universitario
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema diseñado para la distribución organizada de material
            audiovisual académico
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <FeatureItem
              icon={
                <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                  <span className="text-2xl">🎯</span>
                </div>
              }
              title="Enfoque Pedagógico"
              description="Videos diseñados con objetivos de aprendizaje claros y secuencias didácticas"
            />

            <FeatureItem
              icon={
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600">
                  <span className="text-2xl">🔄</span>
                </div>
              }
              title="Actualización Constante"
              description="Contenido académico revisado y actualizado periódicamente"
            />

            <FeatureItem
              icon={
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <span className="text-2xl">📱</span>
                </div>
              }
              title="Acceso Multiplataforma"
              description="Disponible en cualquier dispositivo, con sincronización de progreso"
            />
          </div>

          <div className="relative">
            {/* Tarjeta con diseño de "pizarra universitaria" */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg">
              <div className="p-6">
                <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                      <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Estructura Académica
                    </h3>
                    <p className="text-gray-600">
                      Organización jerárquica del contenido por:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></span>
                        Tecnologias, arquitecturas, etc..
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                        Módulos temáticos
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                        Unidades de aprendizaje
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProjectSection;
