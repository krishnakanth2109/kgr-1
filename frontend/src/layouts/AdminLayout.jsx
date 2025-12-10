// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Image,
  LogOut,
  Menu,
  IndianRupee, // For Fees
  Calendar,    // For Exams
  FileText     // For Documents
} from "lucide-react";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all storage on logout
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("admin-token");
    sessionStorage.removeItem("admin-token");
    navigate("/login/admin");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white shadow-xl transition-all duration-300 flex flex-col sticky top-0 h-screen`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-blue-600">Admin Panel</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* --- EXISTING LINKS (BLUE) --- */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>

          <Link
            to="/admin/students"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Users size={20} />
            {!isCollapsed && <span>Students</span>}
          </Link>

          {/* --- NEW LINKS (GOLD/AMBER HIGHLIGHT) --- */}
          
          <Link
            to="/admin/fees"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
          >
            <IndianRupee size={20} />
            {!isCollapsed && <span>Fee Manager</span>}
          </Link>

          <Link
            to="/admin/exams"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
          >
            <Calendar size={20} />
            {!isCollapsed && <span>Exam Scheduler</span>}
          </Link>

          <Link
            to="/admin/documents"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
          >
            <FileText size={20} />
            {!isCollapsed && <span>Documents</span>}
          </Link>

          {/* --- EXISTING LINKS CONTINUED (BLUE) --- */}

          <Link
            to="/admin/faculty"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <GraduationCap size={20} />
            {!isCollapsed && <span>Faculty</span>}
          </Link>

          <Link
            to="/admin/courses"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <BookOpen size={20} />
            {!isCollapsed && <span>Courses</span>}
          </Link>

          <Link
            to="/admin/gallery"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Image size={20} />
            {!isCollapsed && <span>Gallery</span>}
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* Render child admin pages here */}
      </main>
    </div>
  );
};

export default AdminLayout;