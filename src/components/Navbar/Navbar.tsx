import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu2Line } from "react-icons/ri";
import logo from "../../assets/logo.png";

/* ─── Design Tokens (mirror Home.jsx) ──────────────────────────────── */
const navy = "#0D1F3C";
const navyMid = "#163061";
const gold = "#C49A2A";
const white = "#FFFFFF";
const cream = "#F7F4EE";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/* ─── Thin gold diamond bullet ─────────────────────────────────────── */
const Diamond = () => (
  <span
    style={{
      display: "inline-block",
      width: 5,
      height: 5,
      background: gold,
      transform: "rotate(45deg)",
      marginRight: 8,
      opacity: 0.75,
      flexShrink: 0,
    }}
  />
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close sidebar on route change */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap');

        .ll-nav-link {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: ${navy};
          text-decoration: none;
          position: relative;
          padding-bottom: 3px;
          transition: color 0.2s;
        }
        .ll-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1.5px;
          background: ${gold};
          transition: width 0.25s ease;
        }
        .ll-nav-link:hover { color: ${navyMid}; }
        .ll-nav-link:hover::after { width: 100%; }
        .ll-nav-link.active { color: ${navyMid}; }
        .ll-nav-link.active::after { width: 100%; }

        .ll-cta {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
    
          background: ${navy};
          border: 1.5px solid ${navy};
          padding: 9px 24px;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.22s, transform 0.18s, box-shadow 0.22s;
          display: inline-block;
        }
        .ll-cta:hover {
          background: ${navyMid};
          border-color: ${navyMid};
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13,31,60,0.18);
        }

        .ll-sidebar-link {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${navy};
          text-decoration: none;
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(196,154,42,0.15);
          transition: color 0.2s, padding-left 0.2s;
        }
        .ll-sidebar-link:hover { color: ${navyMid}; padding-left: 6px; }
        .ll-sidebar-link.active { color: ${navyMid}; }

        .ll-wordmark {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: ${navy};
          letter-spacing: 0.5px;
          line-height: 1;
        }
        .ll-wordmark span { color: ${gold}; }
      `}</style>

      {/* ── Main Navbar ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: scrolled ? 0 : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          width: scrolled ? "100%" : "clamp(300px, 85%, 1100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 48px)",
          height: scrolled ? "64px" : "68px",
          borderRadius: scrolled ? "0" : "3px",
          background: white,
          borderBottom: `3px solid ${scrolled ? gold : "transparent"}`,
          border: scrolled ? `none` : `1px solid rgba(196,154,42,0.25)`,
          borderBottomWidth: "3px",
          borderBottomColor: gold,
          boxShadow: scrolled
            ? "0 2px 24px rgba(13,31,60,0.1)"
            : "0 8px 32px rgba(13,31,60,0.09)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Logo + Wordmark */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "2px",
              border: `1.5px solid rgba(196,154,42,0.4)`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: cream,
            }}
          >
            <img
              src={logo}
              alt="LeafLine logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span className="ll-wordmark">
            Leaf<span>Line</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul
          style={{
            display: "none",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "40px",
          }}
          className="md-flex-row"
        >
          <style>{`.md-flex-row { display: none; } @media(min-width:768px){ .md-flex-row { display: flex !important; } }`}</style>
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`ll-nav-link${isActive(to) ? " active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div style={{ display: "none" }} className="md-show">
          <style>{`.md-show { display: none; } @media(min-width:768px){ .md-show { display: block !important; } }`}</style>
          <Link to="/auth/signup" className="ll-cta text-white!">
            Sign In
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className="md-hide"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: navy,
            display: "flex",
            alignItems: "center",
          }}
        >
          <style>{`.md-hide { display: flex; } @media(min-width:768px){ .md-hide { display: none !important; } }`}</style>
          <RiMenu2Line size={24} />
        </button>
      </nav>

      {/* ── Spacer so content doesn't hide under fixed nav ─────────────── */}
      <div style={{ height: "108px" }} />

      {/* ── Mobile Sidebar ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "min(300px, 78vw)",
                height: "100%",
                background: white,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                padding: "0",
                boxShadow: "4px 0 32px rgba(13,31,60,0.14)",
              }}
            >
              {/* Sidebar header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: `3px solid ${gold}`,
                  background: navy,
                }}
              >
                <span className="ll-wordmark" style={{ color: white }}>
                  Leaf<span>Line</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: white,
                    display: "flex",
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Gold accent stripe */}
              <div
                style={{
                  height: "2px",
                  background: `linear-gradient(90deg, ${gold}, rgba(196,154,42,0.1))`,
                }}
              />

              {/* Links */}
              <nav style={{ padding: "32px 24px", flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: gold,
                    marginBottom: "20px",
                    fontWeight: 600,
                  }}
                >
                  Navigation
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  {navLinks.map(({ label, to }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className={`ll-sidebar-link${isActive(to) ? " active" : ""}`}
                      >
                        <Diamond />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Sidebar CTA */}
              <div
                style={{
                  padding: "24px",
                  borderTop: `1px solid rgba(196,154,42,0.2)`,
                  background: cream,
                }}
              >
                <Link
                  to="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="ll-cta"
                  style={{ display: "block", textAlign: "center" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "10px",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: navy,
                    textDecoration: "none",
                    padding: "9px 24px",
                    border: `1.5px solid rgba(13,31,60,0.25)`,
                    borderRadius: "2px",
                    transition: "background 0.2s",
                  }}
                >
                  Create Account
                </Link>
              </div>

              {/* Bottom seal watermark */}
              <div
                style={{
                  textAlign: "center",
                  padding: "14px",
                  fontFamily: "Georgia, serif",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "rgba(13,31,60,0.25)",
                  textTransform: "uppercase",
                }}
              >
                Est. LeafLine · Knowledge First
              </div>
            </motion.aside>

            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(13,31,60,0.45)",
                zIndex: 99,
                backdropFilter: "blur(2px)",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
