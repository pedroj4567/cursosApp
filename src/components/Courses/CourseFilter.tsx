const CourseFilters = () => {
  return (
    <div className="bg-gray-50 ">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4 h-40  border-b-2 border-slate-300">
        <div className=" transform  text-center">
          <h1 className="text-5xl font-bold text-slate-600">Cursos</h1>
        </div>
        <div className="flex space-x-2 z-10">
          {" "}
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-md">
            Todos
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            Favoritos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
