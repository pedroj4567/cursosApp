import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onSearch: () => void;
  categories: Array<{ id: number; name: string; uuid: string; slug: string }>;
}

const SearchFilters = ({
  searchTerm,
  onSearchTermChange,
  selectedCategoryId,
  onCategoryChange,
  onSearch,
  categories,
}: SearchFiltersProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
        >
          Buscar
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Opción "Todos" */}
        <button
          key="all"
          onClick={() => onCategoryChange(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedCategoryId === null
              ? "bg-blue-600 text-white"
              : " text-gray-800 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category.uuid}
            onClick={() => onCategoryChange(category.slug)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategoryId === category.slug // Cambiado de uuid a slug
                ? "bg-blue-600 text-white"
                : " text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
