import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Mail, Phone } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "antd";
import { toast } from "sonner";


const handleSubscribe = (e: React.FormEvent) => {
  e.preventDefault();

  // Here you can later connect API logic
  toast.success("🎉 Subscription successful!");
};

const Footer = () => {
  return (
    <footer className="mt-36 font-sans relative overflow-hidden    pt-20">
      {/* 🔵 Floating Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float-slow"></div>
      <div className="absolute bottom-20 right-16 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>

      {/* Newsletter Banner */}
      <div className="bg-[#02011b] text-white px-6 py-12 rounded-lg mx-4 md:mx-20 -mt-10 relative z-10 shadow-lg">
        <div className="flex md:flex-row justify-center items-center gap-10">
          {/* 📚 Image Section */}


          {/* ✉️ Text & Form */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Stay Updated with Study Resources & New Features
            </h3>
            <p className="text-sm mb-4">
              Subscribe to get the latest study materials, test updates, and collaboration tips!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md !text-white! border-white w-full sm:w-auto"
                required
              />
              <Button
                htmlType="submit"
                className="bg-white !text-blue-950 font-semibold !px-6 !py-4  hover:bg-gray-100"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Sections */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 px-6 md:px-20 py-20 bg-white mt-[-40px] z-0 relative">
        {/* Brand Info */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-[#0d0c22] mb-4">📚LeafLine</h2>
          <p className="text-sm text-gray-600">
            A collaborative platform for students to share notes, take tests, and grow together.
          </p>
          <div className="flex space-x-4 mt-4 text-gray-700">
            <FaGithub className="hover:text-blue-600 cursor-pointer" />
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
            <li><Link to="#">contact</Link></li>

          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Support</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="#">Help Center</Link></li>
            <li><Link to="#">FAQs</Link></li>
            <li><Link to="#">Report an Issue</Link></li>
            <li><Link to="#">Feedback</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Explore</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="#">Upload Notes</Link></li>
            <li><Link to="#">Take Tests</Link></li>
            <li><Link to="#">Collaborate</Link></li>
            <li><Link to="#">Blog</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-bold mb-3 text-gray-800">Contact Us</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <Phone size={16} /> 07086768271
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@LeafLine.app
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t py-6 px-6 md:px-20 text-sm text-gray-500 bg-white flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} LeafLine. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Use</Link>
          <Link to="#">Legal</Link>
          <Link to="#">Sitemap</Link>
        </div>
      </div>

      {/* 🎨 Floating Animations CSS */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) }
            50% { transform: translateY(-20px) }
            100% { transform: translateY(0px) }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float 10s ease-in-out infinite;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
