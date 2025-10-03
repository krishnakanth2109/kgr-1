import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";

// Public pages (can stay normal imports)
import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import Admissions from "../pages/Admissions";
import Contact from "../pages/Contact";
import Gallery from "../pages/Gallery";
import LoginOptions from "../pages/login/LoginOptions";
import AdminLogin from "../pages/login/AdminLogin";
import ForgotPassword from '../components/ForgotPassword';
// Lazy load Admin pages
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const CoursesAdmin = lazy(() => import("../pages/admin/CoursesAdmin"));
const GalleryAdmin = lazy(() => import("../pages/admin/GalleryAdmin"));

// Lazy load Students module (new structure)
const StudentsPage = lazy(() => import("../features/students/StudentsPage"));
const StudentFormPage = lazy(() => import("../features/students/StudentFormPage"));
const StudentProfilePage = lazy(() => import("../features/students/StudentProfilePage"));

// --- NEW FACULTY MODULE IMPORTS ---
// Following the same professional structure as the student module
const FacultyPage = lazy(() => import("../features/faculty/FacultyPage"));
const FacultyFormPage = lazy(() => import("../features/faculty/FacultyFormPage"));
const FacultyProfilePage = lazy(() => import("../features/faculty/FacultyProfilePage"));


const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<LoginOptions />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Admin protected layout */}
         {/* === ADMIN PROTECTED LAYOUT (Unchanged) === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
{/* These admin routes remain untouched */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<CoursesAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />

          {/* --- STUDENT MODULE ROUTES (Unchanged) --- */}
          <Route path="students" element={<StudentsPage />} />
          <Route           path="students/new" element={<StudentFormPage />} />
          <Route path="students/edit/:id" element={<StudentFormPage />} />
          <Route path="students/view/:id" element={<StudentProfilePage />} />

          {/* --- NEW FACULTY MODULE ROUTES --- */}
          {/* This section mirrors the structure of the student module routes. */}
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="faculty/new" element={<FacultyFormPage />} />
          <Route path="faculty/edit/:id" element={<FacultyFormPage />} />
          <Route path="faculty/view/:id" element={<FacultyProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
