import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-xl rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36 flex flex-col md:flex-row items-center gap-12">
          {/* Logo & Text */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8 z-10">
            <img
              src="/logo.png"
              alt="KGR College Logo"
              className="h-20 w-20 rounded-full shadow-lg border-4 border-yellow-300 mb-4 animate-fade-in"
            />
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              Welcome to{" "}
              <span className="text-yellow-300">KGR Vocational Junior College</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl font-medium animate-fade-in">
              Shaping the future of students who aspire to build careers in healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
              <Link
                to="/admissions"
                className="px-8 py-3 bg-yellow-300 text-blue-900 font-bold rounded-lg shadow-lg 
                hover:bg-yellow-400 transition duration-200 hover:scale-105 animate-fade-in"
              >
                Apply Now
              </Link>
              <Link
                to="/courses"
                className="px-8 py-3 border-2 border-yellow-300 text-white rounded-lg 
                hover:bg-yellow-300 hover:text-blue-900 transition duration-200 hover:scale-105 animate-fade-in"
              >
                Explore Courses
              </Link>
            </div>
          </div>
          {/* Hero Image */}
          <div className="flex-1 flex justify-center items-center z-10 animate-fade-in">
            <img
              src="hero.jpg"
              alt="Medical students collaborating in a laboratory practice session at KGR College"
              className="rounded-3xl shadow-2xl border-4 border-white w-full max-w-md object-cover"
            />
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-300 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-indigo-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
      </section>

      {/* Our College Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-10 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900">Our College</h2>
        <p className="text-gray-700 leading-relaxed text-lg font-medium max-w-3xl mx-auto">
          KGR Vocational Junior College is dedicated to shaping the future of students who aspire to build careers in healthcare. 
          With a strong focus on vocational learning, we prepare students with the knowledge, skills, and confidence needed to succeed in today’s healthcare industry.
        </p>
        <p className="text-gray-700 leading-relaxed text-lg font-medium max-w-3xl mx-auto">
          Our flagship programs—Multi-Purpose Health Worker (MPHW) and Medical Laboratory Technology (MLT)—are designed to provide hands-on experience, practical training, and direct pathways to employment in hospitals, clinics, and diagnostic centers.
        </p>
        <div>
          <Link
            to="/admissions"
            className="inline-block px-10 py-4 bg-blue-700 text-white font-bold rounded-lg shadow-lg 
            hover:bg-blue-800 transition duration-200 hover:scale-105 text-lg"
          >
            Start Your Journey – Admissions Open
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 animate-fade-in">
          <img
            src="https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope_23-2147896180.jpg"
            alt="Doctor representing healthcare education at KGR College"
            className="rounded-3xl shadow-2xl border-4 border-blue-700 w-full max-w-md object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left space-y-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">About Us</h2>
          <p className="text-gray-700 leading-relaxed text-lg font-medium">
            KGR Vocational Junior College was founded with the vision of making career-focused education accessible to every student who dreams of entering the healthcare field. We offer more than just a degree; we provide a foundation built on skill-based and practical learning, ensuring students are industry-ready upon graduation.
          </p>
          <Link
            to="/about"
            className="inline-block px-8 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg 
            hover:bg-blue-800 transition duration-200 hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
