const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 text-white py-8">
      {/* Contenido del footer */}
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm md:text-base font-bold">
          © {new Date().getFullYear()} UNERG Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
