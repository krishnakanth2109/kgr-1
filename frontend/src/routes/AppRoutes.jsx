// --- START OF FILE src/routes/AppRoutes.jsx ---
import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom"; // Added Navigate
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

// Auth
import AdminLogin from "../pages/login/AdminLogin";
const StudentLogin = lazy(() => import("../pages/student/StudentLogin"));

// Admin
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const CoursesAdmin = lazy(() => import("../pages/admin/CoursesAdmin"));
const GalleryAdmin = lazy(() => import("../pages/admin/GalleryAdmin"));

const StudentsPage = lazy(() => import("../pages/admin/Students"));

const AdminFeeManager = lazy(() => import("../pages/admin/AdminFeeManager"));
const AdminDocumentManager = lazy(() => import("../pages/admin/AdminDocumentManager"));
const AdminExamManager = lazy(() => import("../pages/admin/AdminExamManager"));

const StudentFeeManager = lazy(() => import("../pages/admin/StudentFeeManager"));
const StudentAcademicManager = lazy(() => import("../pages/admin/StudentAcademicManager"));

const StudentFormPage = lazy(() => import("../features/students/StudentFormPage"));
const StudentProfilePage = lazy(() => import("../features/students/StudentProfilePage"));

const FacultyPage = lazy(() => import("../features/faculty/FacultyPage"));
const FacultyFormPage = lazy(() => import("../features/faculty/FacultyFormPage"));
const FacultyProfilePage = lazy(() => import("../features/faculty/FacultyProfilePage"));

// Student Portal
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
// Renamed/Removed old StudentFees for granular new pages
const StudentFeesPay = lazy(() => import("../pages/student/StudentFeesPay"));
const StudentFeesHistory = lazy(() => import("../pages/student/StudentFeesHistory"));
const StudentExams = lazy(() => import("../pages/student/StudentExams"));
const StudentDocuments = lazy(() => import("../pages/student/StudentDocuments"));

// NEW: Contact Messages Admin Page
const ContactMessages = lazy(() => import("../pages/admin/ContactMessages"));

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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* PUBLIC ROUTES */}
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

        {/* LOGIN ROUTES */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />

        {/* ADMIN ROUTES */}
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
          <Route path="fees" element={<AdminFeeManager />} />
          <Route path="documents" element={<AdminDocumentManager />} />
          <Route path="exams" element={<AdminExamManager />} />

          {/* NEW CONTACT MESSAGES PAGE */}
          <Route path="contact-messages" element={<ContactMessages />} />

          {/* Students */}
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/new" element={<StudentFormPage />} />
          <Route path="students/edit/:id" element={<StudentFormPage />} />
          <Route path="students/view/:id" element={<StudentProfilePage />} />
          <Route path="students/fees/:id" element={<StudentFeeManager />} />
          <Route path="students/academic/:id" element={<StudentAcademicManager />} />

          {/* Faculty */}
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="faculty/new" element={<FacultyFormPage />} />
          <Route path="faculty/edit/:id" element={<FacultyFormPage />} />
          <Route path="faculty/view/:id" element={<FacultyProfilePage />} />
        </Route>

        {/* STUDENT PORTAL */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          
          {/* New Fee Routes Structure */}
          <Route path="fees">
            {/* Redirect /student/fees to /student/fees/pay */}
            <Route index element={<Navigate to="pay" replace />} />
            <Route path="pay" element={<StudentFeesPay />} />
            <Route path="history" element={<StudentFeesHistory />} />
          </Route>

          <Route path="exams" element={<StudentExams />} />
          <Route path="documents" element={<StudentDocuments />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;