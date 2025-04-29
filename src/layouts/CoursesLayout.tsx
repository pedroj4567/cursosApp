import { Outlet } from "react-router-dom";
import Navbar from "../components/Courses/NavBar";

const CoursesLayout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default CoursesLayout;
