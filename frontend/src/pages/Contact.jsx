// --- START OF FILE Contact.jsx ---
import React, { useState } from "react";

const Contact = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  // Errors state
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");

        setFormData({
          fullName: "",
          email: "",
          message: "",
        });

        setErrors({});
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Have questions or need more information? Reach out to us using the
          details below or send us a message directly.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              College Information
            </h2>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">KGR Vocational Junior College</span>
            </p>
            <p className="text-gray-600 mb-2 flex items-center">
              <span className="mr-2">📍</span>
              <a
                href="https://maps.app.goo.gl/iTsUcyxS7i1A2Acx8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 transition"
              >
                Vivek St, Sri Vidya Colony, Jayendra Nagar, Siddartha Nagar,
                Kakinada, Andhra Pradesh 533003
              </a>
            </p>
            <p className="text-gray-600 mb-2 flex items-center">
              <span className="mr-2">📞</span> +91 98765 43210
            </p>
            <p className="text-gray-600 mb-2 flex items-center">
              <span className="mr-2">📧</span> info@kgrcollege.ac.in
            </p>

            {/* Map */}
            <div className="mt-6 rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="KGR College Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3842.123456!2d82.234567!3d16.933456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829fb6890c505%3A0x6d641c9cfcc4d9f0!2sKGR%20Vocational%20Junior%20College!5e0!3m2!1sen!2sin!4v1696212345678!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send a Message
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.fullName ? "border-red-500 ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.email ? "border-red-500 ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.message ? "border-red-500 ring-red-500" : "focus:ring-blue-500"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
