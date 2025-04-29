import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthPage, LandingPage } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import CoursesLayout from "./layouts/CoursesLayout";
import HomeCoursesPage from "./pages/Courses/HomeCoursesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
        </Route>

        <Route element={<CoursesLayout />}>
          <Route index path="/courses" element={<HomeCoursesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
