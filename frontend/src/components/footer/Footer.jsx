import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* College Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            KGR Vocational Junior College
          </h2>
          <p className="text-sm leading-relaxed">
            KGR Vocational Junior College was founded with the vision of making{" "}
            <span className="font-semibold text-blue-400">
              career-focused education
            </span>{" "}
            accessible to every student who dreams of entering the{" "}
            <span className="font-semibold text-blue-400">
              healthcare field
            </span>
            .
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/admissions" className="hover:text-blue-400 transition">
                Admissions
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <FiMapPin className="h-5 w-5 mr-2 text-blue-400" />
              <span>
                Vivek St, Sri Vidya Colony, Jayendra Nagar, Siddartha Nagar,
                Kakinada, Andhra Pradesh 533003
              </span>
            </li>
            <li className="flex items-center">
              <FiPhone className="h-5 w-5 mr-2 text-blue-400" />
              <span>+91 7947103814</span>
            </li>
            <li className="flex items-center">
              <FiMail className="h-5 w-5 mr-2 text-blue-400" />
              <span>info@kgrcollege.ac.in</span>
            </li>
          </ul>
          <div className="mt-4">
            <a
              href="https://www.google.com/local/place/fid/0x3a3829fb6890c505:0x6d641c9cfcc4d9f0/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3DskMP2bSL7k965YnsoKB56A%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D356.4452%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFnNrTVAyYlNMN2s5NjVZbnNvS0I1NkE%3D&sa=X&ved=2ahUKEwjym4L5zbWPAxWok68BHZG-IOMQpx96BAgaEBE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500"
            >
              View Street View
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} KGR Vocational Junior College. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;
