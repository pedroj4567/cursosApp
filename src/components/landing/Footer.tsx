const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-cyan-700 via-teal-500 to-emerald-400 text-white py-8">
      {/* Contenido del footer */}
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Plataforma de Cursos Universitarios.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
