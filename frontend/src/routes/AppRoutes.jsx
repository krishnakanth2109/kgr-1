// --- START OF FILE src/routes/AppRoutes.jsx ---
import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";

// Public pages
import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import Admissions from "../pages/Admissions";
import Contact from "../pages/Contact";
import Gallery from "../pages/Gallery";
import LoginOptions from "../pages/login/LoginOptions";
import ForgotPassword from '../components/ForgotPassword';

// Auth Pages
import AdminLogin from "../pages/login/AdminLogin";
const StudentLogin = lazy(() => import("../pages/student/StudentLogin"));

// --- ADMIN PAGES (Updated to match your screenshot structure) ---
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const CoursesAdmin = lazy(() => import("../pages/admin/CoursesAdmin"));
const GalleryAdmin = lazy(() => import("../pages/admin/GalleryAdmin"));

// 1. The Main Student List
const StudentsPage = lazy(() => import("../pages/admin/Students")); 

// 2. The 3 New Global Admin Managers (Fixes the 404)
const AdminFeeManager = lazy(() => import("../pages/admin/AdminFeeManager"));
const AdminDocumentManager = lazy(() => import("../pages/admin/AdminDocumentManager"));
const AdminExamManager = lazy(() => import("../pages/admin/AdminExamManager"));

// 3. The Specific Student Managers (For editing individual students)
const StudentFeeManager = lazy(() => import("../pages/admin/StudentFeeManager"));
const StudentAcademicManager = lazy(() => import("../pages/admin/StudentAcademicManager"));

// 4. Student Forms (Assuming these are still in features/students or adjust if moved)
const StudentFormPage = lazy(() => import("../features/students/StudentFormPage"));
const StudentProfilePage = lazy(() => import("../features/students/StudentProfilePage"));

// Faculty Features
const FacultyPage = lazy(() => import("../features/faculty/FacultyPage"));
const FacultyFormPage = lazy(() => import("../features/faculty/FacultyFormPage"));
const FacultyProfilePage = lazy(() => import("../features/faculty/FacultyProfilePage"));

// --- STUDENT PORTAL IMPORTS ---
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const StudentFees = lazy(() => import("../pages/student/StudentFees"));
const StudentExams = lazy(() => import("../pages/student/StudentExams"));
const StudentDocuments = lazy(() => import("../pages/student/StudentDocuments"));

// Layout Wrapper for Public Pages
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <Routes>
        
        {/* =========================================
            PUBLIC ROUTES (Wrapped in PublicLayout)
           ========================================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<LoginOptions />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* =========================================
            STANDALONE AUTH ROUTES (No Navbar/Footer)
           ========================================= */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />

        {/* =========================================
            ADMIN PORTAL ROUTES (Protected)
           ========================================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<CoursesAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />

          {/* --- NEW: GLOBAL ADMIN MANAGERS (Fixes 404) --- */}
          <Route path="fees" element={<AdminFeeManager />} />
          <Route path="documents" element={<AdminDocumentManager />} />
          <Route path="exams" element={<AdminExamManager />} />

          {/* Student Directory & Forms */}
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/new" element={<StudentFormPage />} />
          <Route path="students/edit/:id" element={<StudentFormPage />} />
          <Route path="students/view/:id" element={<StudentProfilePage />} />
          
          {/* Individual Student Management (Drill-down) */}
          <Route path="students/fees/:id" element={<StudentFeeManager />} />
          <Route path="students/academic/:id" element={<StudentAcademicManager />} />

          {/* Faculty Management */}
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="faculty/new" element={<FacultyFormPage />} />
          <Route path="faculty/edit/:id" element={<FacultyFormPage />} />
          <Route path="faculty/view/:id" element={<FacultyProfilePage />} />
        </Route>

        {/* =========================================
            STUDENT PORTAL ROUTES (New)
           ========================================= */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="documents" element={<StudentDocuments />} />
        </Route>

        {/* =========================================
            404 PAGE
           ========================================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;