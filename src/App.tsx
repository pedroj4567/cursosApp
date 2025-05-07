import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthPage, LandingPage, MyCoursesPage } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import CoursesLayout from "./layouts/CoursesLayout";
import HomeCoursesPage from "./pages/Courses/HomeCoursesPage";
import { ProtectedRoute } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext"; // Importa el AuthProvider

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
            <Route index path="/my-courses" element={<MyCoursesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
