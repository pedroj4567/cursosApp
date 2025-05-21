/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Course } from "../../pages/Courses/types";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import { courseServices } from "../../services/Courses";
import { categoriesServices } from "../../services/Categories/CategoriesServices";

interface Category {
  id: number;
  name: string;
  uuid: string;
  slug: string;
}

const CourseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(null);

  const [currentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await categoriesServices.getCategories();
        if (response) {
          setCategories(response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    handleSearch(1);
  }, [selectedCategorySlug]);

  const handleSearch = async (page = 1) => {
    setIsLoading(true);

    try {
      const params: Record<string, any> = {
        "pagination[page]": page,
        "pagination[pageSize]": 6,
        populate: "category",
      };
      if (searchTerm.trim()) {
        params["filters[$or][0][title][$containsi]"] = searchTerm;
        params["filters[$or][1][description][$containsi]"] = searchTerm;
      }

      if (selectedCategorySlug) {
        params["filters[category][id][$eq]"] = selectedCategorySlug;
      }
      const response = await courseServices.searchCourses(
        searchTerm,
        selectedCategorySlug,
        page,
        6 // pageSize
      );

      setCourses(response.data);
    } catch (error) {
      console.error("Error searching courses:", error);
      setCourses([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de categoría
  const handleFilterChange = (slug: string | null) => {
    setSelectedCategorySlug(slug);
    handleSearch(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Buscar Cursos</h1>

        <SearchFilters
          categories={categories}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedCategoryId={selectedCategorySlug}
          onCategoryChange={handleFilterChange}
          onSearch={() => handleSearch(1)}
        />

        <SearchResults
          courses={courses}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default CourseSearch;
