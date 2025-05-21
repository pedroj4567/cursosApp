import { Route, BrowserRouter, Routes } from "react-router-dom";
import {
  AuthPage,
  CourseDetailsPage,
  CoursePlayerPage,
  LandingPage,
  MyCoursesPage,
  SearchCoursesPage,
} from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import CoursesLayout from "./layouts/CoursesLayout";
import HomeCoursesPage from "./pages/Courses/HomeCoursesPage";
import { ProtectedRoute } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext"; // Importa el AuthProvider
import { CoursePlayLayout } from "./layouts/CoursePlayLayout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<AuthPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <CoursesLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/courses" element={<HomeCoursesPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/search" element={<SearchCoursesPage />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
          </Route>
        </Routes>

        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <CoursePlayLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              path="/course/video/:id"
              element={<CoursePlayerPage />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
