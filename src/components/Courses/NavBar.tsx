const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-cyan-700 to-teal-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">FrostAcademy</div>

        <div className="hidden md:flex space-x-6">
          <a
            href="#"
            className="hover:text-cyan-100 transition border-b-2  border-white"
          >
            Home
          </a>
          <a href="#" className="font-semibold ">
            Mis Cursos
          </a>
          <a href="#" className="hover:text-cyan-100 transition">
            Buscador
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Q"
              className="w-8 h-8 rounded-full bg-white/20 text-white text-center focus:w-60 focus:px-3 focus:text-left transition-all duration-300"
            />
          </div>
          <button className="bg-white text-cyan-700 px-4 py-1 rounded-md hover:bg-gray-100 transition">
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
