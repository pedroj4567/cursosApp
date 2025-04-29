import { Button } from "flowbite-react";
import CourseCard from "../../components/Courses/CourseCard";
import CourseFilters from "../../components/Courses/CourseFilter";

const HomeCoursesPage = () => {
  const courses = [
    {
      title: "Desarrollo Web",
      category: "Desarrollo Web",
      description:
        "Absolutely! Work more. Earn more while sitting at your home",
      lessons: "12 Lessons",
      duration: "3 hr 30 min",
    },
    {
      title: "Cyber Seguridad",
      category: "Marketing",
      description: "Foundation course to understand about Software",
      lessons: "21 Lessons",
      duration: "1 hr 30 min",
    },
    {
      title: "Desarrollo Movil",
      category: "Marketing",
      description: "Negative Thoughts",
      lessons: "23 Lessons",
      duration: "1 hr 20 min",
    },
    {
      title: "Cyber Seguridad",
      category: "Marketing",
      description: "Foundation course to understand about Software",
      lessons: "21 Lessons",
      duration: "1 hr 30 min",
    },
    {
      title: "Desarrollo Movil",
      category: "Marketing",
      description: "Negative Thoughts",
      lessons: "23 Lessons",
      duration: "1 hr 20 min",
    },
    {
      title: "Cyber Seguridad",
      category: "Marketing",
      description: "Foundation course to understand about Software",
      lessons: "21 Lessons",
      duration: "1 hr 30 min",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseFilters />

      <section className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              category={course.category}
              description={course.description}
              lessons={course.lessons}
              duration={course.duration}
              imageUrl="https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress"
            />
          ))}
        </div>
        <div className="my-5  flex justify-center ">
          <Button className="bg-teal-600 hover:bg-teal-700 transition-colors px-10 py-2 cursor-pointer">
            Ver mas
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomeCoursesPage;
