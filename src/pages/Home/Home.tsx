import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeImage from "../../../src/assets/mainHomeImg.png";
import Navbar from "../../components/Navbar/Navbar";
import FeatureSection from "./FeatureSection";
import CategoriesSection from "./categories";
import Stats from "./Stats";
import TestimonialCarousel from "./TestimonialCarousel";
import Footer from "../../components/footer/Footer";

/* ─── Design Tokens ─────────────────────────────────────────────────── */
const tokens = {
  navy:    "#0D1F3C",
  navyMid: "#163061",
  gold:    "#C49A2A",
  goldLight:"#E8C05A",
  cream:   "#F7F4EE",
  white:   "#FFFFFF",
  slate:   "#4A5568",
  muted:   "#8A9BB0",
};

/* ─── Decorative SVG crest / seal ───────────────────────────────────── */
const Crest = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="34" stroke={tokens.gold} strokeWidth="2" />
    <circle cx="36" cy="36" r="28" stroke={tokens.gold} strokeWidth="0.75" strokeDasharray="4 3" />
    <path d="M36 12 L40 26 L54 26 L43 34 L47 48 L36 40 L25 48 L29 34 L18 26 L32 26 Z"
      fill={tokens.gold} opacity="0.85" />
    <text x="36" y="60" textAnchor="middle" fontSize="6" fill={tokens.gold}
      fontFamily="Georgia, serif" letterSpacing="2">LEAFLINE</text>
  </svg>
);

/* ─── Thin horizontal rule with diamond ─────────────────────────────── */
const Divider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"0 auto", maxWidth:"320px" }}>
    <div style={{ flex:1, height:"1px", background: tokens.gold, opacity:0.4 }} />
    <div style={{ width:"6px", height:"6px", background: tokens.gold, transform:"rotate(45deg)", opacity:0.7 }} />
    <div style={{ flex:1, height:"1px", background: tokens.gold, opacity:0.4 }} />
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const Home = () => {
  return (
    <div style={{ background: tokens.white, color: tokens.navy, fontFamily:"Georgia, 'Times New Roman', serif" }}>

      {/* Inject Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');

        .leafline-hero { font-family: 'Cormorant Garamond', Georgia, serif; }
        .leafline-body { font-family: 'Source Sans 3', sans-serif; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F7F4EE;
          border: 1px solid rgba(196,154,42,0.35);
          border-radius: 2px;
          padding: 5px 14px;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C49A2A;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
        }

        .cta-primary {
          background: #0D1F3C;
          color: #E8C05A;
          border: 1.5px solid #0D1F3C;
          padding: 13px 36px;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
        }
        .cta-primary:hover {
          background: #163061;
          border-color: #163061;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(13,31,60,0.18);
        }

        .cta-secondary {
          background: transparent;
          color: #0D1F3C;
          border: 1.5px solid rgba(13,31,60,0.3);
          padding: 13px 36px;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
        }
        .cta-secondary:hover {
          border-color: #0D1F3C;
          background: rgba(13,31,60,0.04);
        }

        .stat-card {
          text-align: center;
          padding: 32px 24px;
          border: 1px solid rgba(196,154,42,0.18);
          background: #F7F4EE;
          border-radius: 3px;
          transition: box-shadow 0.2s;
        }
        .stat-card:hover {
          box-shadow: 0 4px 24px rgba(13,31,60,0.08);
        }

        .pattern-bg {
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(196,154,42,0.06) 39px,
              rgba(196,154,42,0.06) 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(196,154,42,0.06) 39px,
              rgba(196,154,42,0.06) 40px
            );
        }

        .corner-ornament::before,
        .corner-ornament::after {
          content: '';
          position: absolute;
          width: 32px;
          height: 32px;
          border-color: rgba(196,154,42,0.4);
          border-style: solid;
        }
        .corner-ornament::before {
          top: 24px; left: 24px;
          border-width: 1px 0 0 1px;
        }
        .corner-ornament::after {
          bottom: 24px; right: 24px;
          border-width: 0 1px 1px 0;
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section
        className="pattern-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 60px",
          position: "relative",
          background: tokens.white,
        }}
      >
        {/* Top left decorative line block */}
        {/* <div style={{
          position:"absolute", top:0, left:0, right:0,
          height:"4px",
          background:`linear-gradient(90deg, ${tokens.navy} 0%, ${tokens.gold} 50%, ${tokens.navy} 100%)`
        }} /> */}

        {/* Watermark text */}
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          fontSize:"clamp(80px, 16vw, 200px)",
          fontFamily:"'Cormorant Garamond', serif",
          fontWeight:700, color: tokens.navy,
          opacity:0.025, userSelect:"none",
          whiteSpace:"nowrap", pointerEvents:"none",
          letterSpacing:"-4px",
        }}>
          LeafLine
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ textAlign:"center", maxWidth:"740px", position:"relative", zIndex:1 }}
        >
          {/* Crest */}
          <motion.div
            initial={{ opacity:0, scale:0.8 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.2, duration:0.6 }}
            style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}
          >
            <Crest />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.35, duration:0.6 }}
            style={{ marginBottom:"20px" }}
          >
            <span className="hero-badge">
              <span style={{ width:5, height:5, borderRadius:"50%", background:tokens.gold, display:"inline-block" }} />
              Your Gateway to Academic Excellence
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="leafline-hero"
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.45, duration:0.7 }}
            style={{
              fontSize:"clamp(40px, 6vw, 72px)",
              fontWeight:700,
              lineHeight:1.1,
              color: tokens.navy,
              marginBottom:"16px",
              letterSpacing:"-0.5px",
            }}
          >
            Read.{" "}
            <span style={{ color: tokens.gold, fontStyle:"italic" }}>Study.</span>{" "}
            Grow with{" "}
            <span style={{
              color: tokens.navyMid,
              borderBottom:`3px solid ${tokens.gold}`,
              paddingBottom:"2px",
            }}>
              LeafLine
            </span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ opacity:0, scaleX:0 }}
            animate={{ opacity:1, scaleX:1 }}
            transition={{ delay:0.6, duration:0.5 }}
            style={{ margin:"24px auto" }}
          >
            <Divider />
          </motion.div>

          {/* Sub-heading */}
          <motion.p
            className="leafline-body"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.7, duration:0.6 }}
            style={{
              fontSize:"clamp(15px, 2vw, 18px)",
              color: tokens.slate,
              lineHeight:1.75,
              marginBottom:"40px",
              fontWeight:300,
            }}
          >
            LeafLine is your personal digital study hub. Access thousands of curated
            study materials, read scholarly texts, and organise your academic journey
            with precision and clarity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.82, duration:0.5 }}
            style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}
          >
            <Link to="/auth/signup" className="cta-primary">
              Begin Your Journey
            </Link>
            <Link to="/explore" className="cta-secondary">
              Explore Library
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity:0, y:48 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.6, duration:1, ease:"easeOut" }}
          style={{ marginTop:"64px", position:"relative", zIndex:1, maxWidth:"860px", width:"100%" }}
        >
          {/* Frame border */}
          <div style={{
            position:"absolute", inset:"-10px",
            border:`1px solid rgba(196,154,42,0.25)`,
            borderRadius:"6px",
            pointerEvents:"none",
          }} />
          {/* Inner subtle shadow strip */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"100%",
            background:"linear-gradient(to bottom, rgba(247,244,238,0.0) 70%, rgba(247,244,238,0.6) 100%)",
            borderRadius:"4px",
            pointerEvents:"none",
            zIndex:2,
          }} />
          {/* <motion.img
            src={HomeImage}
            alt="LeafLine Academic Platform Preview"
            style={{
              width:"100%",
              objectFit:"contain",
              borderRadius:"4px",
              border:`1px solid rgba(13,31,60,0.08)`,
              boxShadow:"0 24px 64px rgba(13,31,60,0.12), 0 4px 16px rgba(13,31,60,0.06)",
            }}
            whileHover={{ scale:1.015 }}
            transition={{ type:"spring", stiffness:100, damping:20 }}
          /> */}
        </motion.div>

        {/* Scroll nudge */}
        <motion.div
          animate={{ y:[0, 8, 0] }}
          transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
          style={{ marginTop:"48px", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", opacity:0.45 }}
        >
          <span className="leafline-body" style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color: tokens.navy }}>
            Scroll
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0 L8 20 M2 14 L8 20 L14 14" stroke={tokens.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        viewport={{ once:true }}
        transition={{ duration:0.7 }}
        style={{
          background: tokens.navy,
          padding:"28px 24px",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          gap:"clamp(24px, 5vw, 64px)",
          flexWrap:"wrap",
        }}
      >
        {["Trusted by 50+ Universities","10,000+ Academic Texts","Peer-Reviewed Resources","Secure & Private"].map((label, i) => (
          <div key={i} className="leafline-body" style={{
            display:"flex", alignItems:"center", gap:"10px",
            color:"rgba(255,255,255,0.75)", fontSize:"13px", letterSpacing:"0.5px",
          }}>
            <span style={{ color: tokens.gold, fontSize:"16px" }}>✦</span>
            {label}
          </div>
        ))}
      </motion.section>

      {/* ── Page Sections ───────────────────────────────────────────────── */}
      <CategoriesSection />
      <FeatureSection />
      <Stats />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
};

export default Home;