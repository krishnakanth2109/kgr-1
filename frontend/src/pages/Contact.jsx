import React from "react";

const Contact = () => {
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
      href="https://www.google.com/local/place/fid/0x3a3829fb6890c505:0x6d641c9cfcc4d9f0/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3DskMP2bSL7k965YnsoKB56A%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D356.4452%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFnNrTVAyYlNMN2s5NjVZbnNvS0I1NkE%3D&sa=X&ved=2ahUKEwjym4L5zbWPAxWok68BHZG-IOMQpx96BAgaEBE"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:text-blue-800 transition"
    >
      Vivek St, Sri Vidya Colony, Jayendra Nagar, Siddartha Nagar, Kakinada, Andhra Pradesh 533003
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
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
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
