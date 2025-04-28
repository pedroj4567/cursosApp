const LandingNav = () => {
  return (
    <nav className="relative z-20 px-6 py-6 lg:px-12 flex justify-between items-center">
      <div className="text-2xl font-bold text-white">FrostAcademy</div>
      <ul className="hidden md:flex space-x-8">
        <li>
          <a href="#" className="text-white hover:text-cyan-200 transition">
            Inicio
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-cyan-200 transition">
            Programas
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-cyan-200 transition">
            Profesores
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-cyan-200 transition">
            Contacto
          </a>
        </li>
      </ul>
      <button className="md:hidden text-white">
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
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </nav>
  );
};

export default LandingNav;
