import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Mail, Phone } from "lucide-react";
import NewsletterImage from "../../../src/assets/homebook.png"; // ✅ You can replace this with any book illustration
import { Input } from "../ui/input";

const Footer = () => {
  return (
    <footer className="mt-36 font-sans">
      {/* Newsletter Banner */}
      <div className="bg-[#02011b] text-white px-6 py-12 rounded-lg mx-4 md:mx-20 -mt-10 relative z-10 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* 📚 Image Section */}
          <div className="w-full md:w-1/3">
            <img
              src={NewsletterImage}
              alt="Book Newsletter"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* ✉️ Text & Form */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Subscribe to our newsletter to get updates on the latest collections
            </h3>
            <p className="text-sm mb-4">
              Get 20% off on your first e-book just by subscribing!
            </p>
            <form className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md !text-white w-full sm:w-auto"
                required
              />
              <button
                type="submit"
                className="bg-white !text-blue-950 font-semibold px-6 py-2 rounded-md hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Sections */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 px-6 md:px-20 py-20 bg-white mt-[-40px] z-0 relative">
        {/* Brand Info */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-[#0d0c22] mb-4">📚 LeafLine</h2>
          <p className="text-sm text-gray-600">
            Your digital companion for exploring, reading, and managing books across all genres.
          </p>
          <div className="flex space-x-4 mt-4 text-gray-700">
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-800 cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Company</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">Community</Link></li>
            <li><Link to="#">Reviews</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Support</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="#">Help Center</Link></li>
            <li><Link to="#">Tweet @ Us</Link></li>
            <li><Link to="#">Webinars</Link></li>
            <li><Link to="#">Feedback</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Explore</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="#">Free E-books</Link></li>
            <li><Link to="#">Join as Author</Link></li>
            <li><Link to="#">Genre Explorer</Link></li>
            <li><Link to="#">Blog</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Contact Us</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +234 901 234 5678
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@leafline.app
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t py-6 px-6 md:px-20 text-sm text-gray-500 bg-white flex flex-col md:flex-row justify-between items-center">
        <p>© Copyright by LeafLine. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Use</Link>
          <Link to="#">Legal</Link>
          <Link to="#">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
