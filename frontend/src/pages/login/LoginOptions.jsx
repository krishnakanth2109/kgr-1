import React from "react";
import { Link } from "react-router-dom";

const LoginOptions = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        {/* Logo / Heading */}
        <img
          src="https://img.icons8.com/color/96/admin-settings-male.png"
          alt="Admin Login"
          className="mx-auto mb-6 w-24 h-24"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Administrator Login
        </h1>
        <p className="text-gray-600 mb-8">
          Access the admin panel to manage admissions, courses, and student records.
        </p>

        {/* CTA Button */}
        <Link
          to="/login/admin"
          className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl"
        >
          Proceed to Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default LoginOptions;
