import React, { useState } from "react";
import { Award, HeartHandshake, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [showValues, setShowValues] = useState(false);

  const pillars = [
    {
      icon: <HeartHandshake className="mx-auto mb-4 text-blue-600" size={40} />,
      title: "Mission",
      text: "To provide affordable, high-quality vocational education in healthcare, empowering students with practical skills, ethical values, and a passion for serving society.",
    },
    {
      icon: <Lightbulb className="mx-auto mb-4 text-indigo-600" size={40} />,
      title: "Vision",
      text: "To be recognized as a leading vocational institution producing skilled, compassionate, and industry-ready healthcare professionals.",
    },
    {
      icon: <Award className="mx-auto mb-4 text-yellow-500" size={40} />,
      title: "Core Values",
      shortText: "Integrity, Excellence, Growth, Social Responsibility.",
      fullText: (
        <>
          <p><strong>Integrity in Education</strong> – Upholding honesty, transparency, and fairness in learning.</p>
          <p className="mt-2"><strong>Excellence in Training</strong> – Delivering top-quality practical and theoretical education.</p>
          <p className="mt-2"><strong>Student-Centered Growth</strong> – Focusing on holistic development and career readiness.</p>
          <p className="mt-2"><strong>Social Responsibility in Healthcare</strong> – Instilling values of service and compassion toward society.</p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-xl rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          <img
            src="/logo.png"
            alt="KGR Logo"
            className="h-24 w-24 rounded-full shadow-lg border-4 border-yellow-300 animate-fade-in"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-fade-in">
            Empowering Students Through{" "}
            <span className="text-yellow-300">Vocational Excellence</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed font-medium animate-fade-in">
            KGR Vocational Junior College was founded with the vision of making career-focused education accessible to every student who dreams of entering the healthcare field. We offer more than just a degree; we provide a foundation built on skill-based and practical learning, ensuring students are industry-ready upon graduation.
          </p>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
      </section>

      {/* Who We Are / What We Are Section */}
      <section className="container mx-auto px-6 lg:px-20 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 animate-fade-in">
          <div>
            <h2 className="text-4xl font-extrabold text-blue-900 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              At KGR Vocational Junior College, we define ourselves as pioneers in vocational healthcare education. Our identity is rooted in the belief that every student has the potential to become a skilled healthcare professional. We're more than an institution; we're a community dedicated to nurturing talent, fostering a strong work ethic, and preparing you for a fulfilling career. Our strength lies in combining academic learning with practical exposure, building both competence and compassion.
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-blue-900 mb-6">What We Are</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              KGR Vocational Junior College is a crucial bridge between academics and the healthcare industry. We understand that the best way to learn is by doing. That's why our programs are centered on hands-on training, with access to modern labs and opportunities for real-time exposure to the professional world. Our goal isn't just to educate you, but to ensure your employability. We are committed to making sure every graduate is job-ready and well-equipped for their future.
            </p>
          </div>
        </div>
        <div className="flex justify-center animate-fade-in">
          <img
            src="https://img.freepik.com/free-vector/college-university-concept-illustration_114360-10538.jpg"
            alt="Students learning at KGR College"
            className="rounded-3xl shadow-2xl border-4 border-blue-700 w-full max-w-md object-cover hover:scale-105 transition duration-500"
          />
        </div>
      </section>

      {/* Mission / Vision / Values Section */}
      <section className="bg-blue-50 py-24 px-6">
        <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-20">
          Our Guiding Principles
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition duration-300 text-center animate-fade-in"
            >
              {pillar.icon}
              <h3 className="text-2xl font-bold mb-4 text-blue-700">{pillar.title}</h3>
              <div className="text-gray-700 font-medium leading-relaxed">
                {pillar.title === "Core Values" ? (
                  <>
                    <p>{pillar.shortText}</p>
                    {showValues && <div className="mt-4 text-left">{pillar.fullText}</div>}
                    <button
                      onClick={() => setShowValues(!showValues)}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center mx-auto"
                    >
                      {showValues ? (
                        <>
                          Show Less <ChevronUp className="ml-2" size={20} />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown className="ml-2" size={20} />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <p>{pillar.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
