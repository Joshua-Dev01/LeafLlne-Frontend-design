import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div className="font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif] bg-[#F7F4EE]">

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 pt-16 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="
            relative overflow-hidden
            bg-[#0D1F3C] rounded-2xl
            px-8 md:px-20 py-16
            text-center
          "
        >
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.55) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Gold top rule */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />

          {/* Corner brackets */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-amber-400/40 rounded-tl-sm" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-amber-400/40 rounded-tr-sm" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-amber-400/40 rounded-bl-sm" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-amber-400/40 rounded-br-sm" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Label */}
            <p className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.25em] uppercase text-amber-500 mb-5">
              <span className="inline-block w-5 h-px bg-amber-500" />
              Begin Your Academic Journey
              <span className="inline-block w-5 h-px bg-amber-500" />
            </p>

            {/* Heading */}
            <h2 className="font-['Georgia',_serif] text-white text-3xl md:text-[42px] font-bold leading-tight mb-4">
              Ready to Elevate Your{" "}
              <em className="text-amber-400 not-italic">Studies?</em>
            </h2>

            {/* Sub */}
            <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Join thousands of students already learning smarter with LeafLine.
              Your academic community, your resources, your success — all in one place.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/signup"
                className="
                  px-8 py-3.5 bg-amber-500 hover:bg-amber-400
                  text-[#0D1F3C] font-semibold text-sm
                  tracking-[0.12em] uppercase rounded-lg
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(196,154,42,0.35)]
                "
              >
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="
                  px-8 py-3.5
                  border border-white/25 hover:border-white/50
                  text-white text-sm font-semibold
                  tracking-[0.12em] uppercase rounded-lg
                  transition-all duration-200 hover:bg-white/5
                "
              >
                Explore LeafLine
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Minimal Footer Bar ────────────────────────────────────── */}
      <footer className="bg-[#F7F4EE] px-6 md:px-16 py-8 border-t border-amber-200/40 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left — wordmark + tagline */}
          <div>
            <span className="font-['Georgia',_serif] text-xl font-bold text-[#0D1F3C]">
              Leaf<span className="text-amber-600">Line</span>
            </span>
            <p className="text-slate-500 text-xs mt-1 font-light tracking-wide">
              © {new Date().getFullYear()} LeafLine. Empowering Scholarly Excellence.
            </p>
          </div>

          {/* Center — nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { label: "Privacy Policy",       to: "#" },
              { label: "Terms of Service",     to: "#" },
              { label: "Contact Support",      to: "/contact" },
              { label: "Careers",              to: "#" },
              { label: "Community Guidelines", to: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="
                  text-slate-500 hover:text-[#0D1F3C]
                  text-xs tracking-wide transition-colors duration-200
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — socials */}
          <div className="flex items-center gap-3">
            {[
              { icon: <FaGithub size={15} />,     label: "GitHub",    href: "#" },
              { icon: <FaTwitter size={15} />,    label: "Twitter",   href: "#" },
              { icon: <FaInstagram size={15} />,  label: "Instagram", href: "#" },
              { icon: <FaLinkedinIn size={15} />, label: "LinkedIn",  href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="
                  w-8 h-8 flex items-center justify-center
                  border border-amber-300/50 text-slate-500
                  hover:border-amber-500 hover:text-amber-600
                  rounded-sm transition-all duration-200
                "
              >
                {s.icon}
              </a>
            ))}
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;