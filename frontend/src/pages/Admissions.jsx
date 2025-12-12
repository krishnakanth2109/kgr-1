import React, { useState, useRef, useEffect } from "react";
import {
  FaFileAlt,
  FaIdCard,
  FaMoneyCheckAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Application Form",
    description:
      "Fill out the admission application form with accurate personal and academic details.",
    icon: <FaFileAlt className="text-white text-2xl" />,
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Document Submission",
    description:
      "Submit required documents including ID proof, previous mark sheets, and passport-size photos.",
    icon: <FaIdCard className="text-white text-2xl" />,
    color: "bg-green-600",
  },
  {
    id: 3,
    title: "Fee Payment",
    description:
      "Pay the admission fee online or at the college office to confirm your seat.",
    icon: <FaMoneyCheckAlt className="text-white text-2xl" />,
    color: "bg-indigo-600",
  },
];

const Admissions = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    idProof: null,
    marksheet: null,
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  // Accessibility: trap focus in modal
  useEffect(() => {
    if (showModal) {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setShowModal(false);
        if (e.key === "Tab" && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'input, select, button, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showModal]);

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required.";
      if (!formData.email.trim()) newErrors.email = "Email is required.";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Invalid email format.";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Enter a valid 10-digit phone number.";
      if (!formData.course) newErrors.course = "Please select a course.";
    }
    if (step === 2) {
      if (!formData.idProof) newErrors.idProof = "ID Proof is required.";
      if (!formData.marksheet) newErrors.marksheet = "Marksheet is required.";
      if (!formData.photo) newErrors.photo = "Photo is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep()) return;

  // Convert files to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          name: file.name,
          mimeType: file.type,
          data: reader.result.split(",")[1], // remove "data:...base64,"
        });
      reader.onerror = reject;
    });

  const payload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    course: formData.course,
    idProof: formData.idProof ? await fileToBase64(formData.idProof) : null,
    marksheet: formData.marksheet ? await fileToBase64(formData.marksheet) : null,
    photo: formData.photo ? await fileToBase64(formData.photo) : null,
  };

  try {
    const res = await fetch("http://localhost:5000/api/admissions", {  method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    if (result.status === "success") {
      alert("Application submitted successfully!");
      setShowModal(false);
      setStep(1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        idProof: null,
        marksheet: null,
        photo: null,
      });
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    alert("Something went wrong.");
    console.error(error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-900 to-purple-900 text-white py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-blue-200 uppercase tracking-widest text-sm mb-4">
            Admissions 2025 Open
          </p>
          <h1 className="text-5xl font-extrabold drop-shadow-lg">
            Admissions Portal
          </h1>
          <p className="mt-6 text-lg text-blue-100 max-w-3xl mx-auto">
            Begin your journey at{" "}
            <span className="font-semibold">KGR Vocational Junior College</span>
            . Follow the guided process to secure your admission today.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-white text-blue-800 font-semibold rounded-lg shadow-md hover:scale-105 transition"
            >
              Quick Apply
            </button>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="max-w-5xl mx-auto mt-16 px-6">
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center w-full">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full ${step.color} shadow-lg z-10`}
              >
                {step.icon}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-800">
                {step.title}
              </p>
              {index < steps.length - 1 && (
                <div className="absolute top-7 left-[15%] right-[15%] border-t-4 border-blue-200 -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Steps */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-10">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full ${step.color} shadow-md`}
            >
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">
              Step {step.id}: {step.title}
            </h3>
            <p className="text-gray-600 mt-2">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-blue-900 text-white text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Ready to begin your journey with us?
        </h2>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:scale-105 transition"
          >
            Apply Now
          </button>
        </div>
        <div className="flex justify-center space-x-8 text-blue-200 text-sm">
          <div className="flex items-center space-x-2">
            <FaCheckCircle /> <span>Accredited Programs</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCheckCircle /> <span>Experienced Faculty</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCheckCircle /> <span>Career-Oriented Courses</span>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 relative"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 120 }}
              tabIndex={-1}
              aria-modal="true"
              role="dialog"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Stepper */}
              <div className="flex justify-between mb-8">
                {["Personal", "Documents", "Review"].map((label, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center relative ${step === i + 1 ? "text-blue-600 font-bold" : "text-gray-400"}`}
                  >
                    <span
                      className={`block w-8 h-8 mx-auto rounded-full border-2 ${step === i + 1 ? "border-blue-600 bg-blue-100" : "border-gray-300 bg-gray-100"} flex items-center justify-center font-bold text-lg mb-2`}
                    >
                      {i + 1}
                    </span>
                    {label}
                    {i < 2 && (
                      <span className="absolute top-4 right-0 w-8 h-1 bg-blue-200 rounded-full"></span>
                    )}
                  </div>
                ))}
              </div>

              <form className="space-y-6" autoComplete="off">
                {step === 1 && (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.name ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                      />
                      {errors.name && (
                        <span
                          id="name-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.name}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                      />
                      {errors.email && (
                        <span
                          id="email-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.phone ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.phone}
                        aria-describedby={
                          errors.phone ? "phone-error" : undefined
                        }
                      />
                      {errors.phone && (
                        <span
                          id="phone-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.phone}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="course"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Course
                      </label>
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.course ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.course}
                        aria-describedby={
                          errors.course ? "course-error" : undefined
                        }
                      >
                        <option value="">Select Course</option>
                        <option value="MPHW">
                          MPHW - Multi-Purpose Health Worker
                        </option>
                        <option value="MLT">
                          MLT - Medical Laboratory Technology
                        </option>
                      </select>
                      {errors.course && (
                        <span
                          id="course-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.course}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="idProof"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        ID Proof
                      </label>
                      <input
                        id="idProof"
                        type="file"
                        name="idProof"
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.idProof ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.idProof}
                        aria-describedby={
                          errors.idProof ? "idProof-error" : undefined
                        }
                      />
                      {errors.idProof && (
                        <span
                          id="idProof-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.idProof}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="marksheet"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Marksheet
                      </label>
                      <input
                        id="marksheet"
                        type="file"
                        name="marksheet"
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.marksheet ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.marksheet}
                        aria-describedby={
                          errors.marksheet ? "marksheet-error" : undefined
                        }
                      />
                      {errors.marksheet && (
                        <span
                          id="marksheet-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.marksheet}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="photo"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Passport Size Photo
                      </label>
                      <input
                        id="photo"
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.photo ? "border-red-500" : ""}`}
                        required
                        aria-invalid={!!errors.photo}
                        aria-describedby={
                          errors.photo ? "photo-error" : undefined
                        }
                      />
                      {errors.photo && (
                        <span
                          id="photo-error"
                          className="text-red-500 text-sm mt-1 block"
                        >
                          {errors.photo}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="font-semibold mb-4">Review Your Details</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>Name:</strong> {formData.name}
                      </li>
                      <li>
                        <strong>Email:</strong> {formData.email}
                      </li>
                      <li>
                        <strong>Phone:</strong> {formData.phone}
                      </li>
                      <li>
                        <strong>Course:</strong> {formData.course}
                      </li>
                      <li>
                        <strong>ID Proof:</strong>{" "}
                        {formData.idProof && (
                          <>
                            <span className="mr-2">
                              {formData.idProof.name}
                            </span>
                            <a
                              href={URL.createObjectURL(formData.idProof)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View
                            </a>
                          </>
                        )}
                      </li>
                      <li>
                        <strong>Marksheet:</strong>{" "}
                        {formData.marksheet && (
                          <a
                            href={URL.createObjectURL(formData.marksheet)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Marksheet
                          </a>
                        )}
                      </li>
                      <li>
                        <strong>Photo:</strong>{" "}
                        {formData.photo && (
                          <a
                            href={URL.createObjectURL(formData.photo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Photo
                          </a>
                        )}
                      </li>
                    </ul>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admissions;
