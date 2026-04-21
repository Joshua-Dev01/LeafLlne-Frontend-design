import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─── Design Tokens ─────────────────────────────────────────────────── */
const navy    = "#0D1F3C";
const navyMid = "#163061";
const gold    = "#C49A2A";
const cream   = "#F7F4EE";
const slate   = "#4A5568";

const categories = [
  {
    title: "Study Analytics",
    roman: "I",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    desc: "Track your learning journey with intelligent analytics. Monitor reading time, completed texts, and study milestones to maintain academic momentum and reach your goals.",
  },
  {
    title: "AI Practice Tests",
    roman: "II",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    desc: "Challenge yourself with AI-powered assessments and mock examinations. Receive instant feedback, identify knowledge gaps, and refine your academic proficiency over time.",
  },
  {
    title: "Collaboration",
    roman: "III",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    desc: "Join scholarly study groups, exchange annotated notes, and engage in academic discourse with peers across disciplines and departments.",
  },
];

/* ─── Ornamental Divider ────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"0 auto 48px" }}>
    <div style={{ flex:1, height:"1px", background:`rgba(196,154,42,0.25)` }} />
    <div style={{ width:6, height:6, background:gold, transform:"rotate(45deg)", opacity:0.7 }} />
    <div style={{ flex:1, height:"1px", background:`rgba(196,154,42,0.25)` }} />
  </div>
);

export default function CategoriesSection() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Source+Sans+3:wght@300;400;600&display=swap');

        .cat-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(196,154,42,0.18);
          border-top: 3px solid ${gold};
          border-radius: 3px;
          padding: 36px 32px 40px;
          box-shadow: 0 2px 12px rgba(13,31,60,0.05);
          transition: box-shadow 0.25s ease, transform 0.25s ease, border-top-color 0.25s;
          overflow: hidden;
        }
        .cat-card:hover {
          box-shadow: 0 12px 40px rgba(13,31,60,0.1);
          transform: translateY(-4px);
          border-top-color: ${navyMid};
        }
        .cat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(196,154,42,0.15), transparent);
        }

        .cat-roman {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 80px;
          font-weight: 700;
          color: ${navy};
          opacity: 0.05;
          position: absolute;
          bottom: -8px;
          right: 16px;
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }

        .cat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 2px;
          background: ${cream};
          border: 1px solid rgba(196,154,42,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${navy};
          margin-bottom: 20px;
        }

        .cat-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: ${navy};
          margin: 0 0 12px;
        }

        .cat-desc {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 14.5px;
          color: ${slate};
          line-height: 1.75;
          font-weight: 300;
          margin: 0;
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .cat-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 580px) {
          .cat-grid { grid-template-columns: 1fr; }
        }

        .section-label {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: ${gold};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .section-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(32px, 4.5vw, 50px);
          font-weight: 700;
          color: ${navy};
          line-height: 1.1;
          margin: 0 0 20px;
          text-align: center;
        }
        .section-heading em {
          font-style: italic;
          color: ${navyMid};
        }

        .section-sub {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 16px;
          color: ${slate};
          font-weight: 300;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 40px;
          text-align: center;
        }
      `}</style>

      <section style={{
        padding: "96px 24px",
        background: cream,
        borderTop: `1px solid rgba(196,154,42,0.15)`,
        borderBottom: `1px solid rgba(196,154,42,0.15)`,
      }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

          {/* ── Section Header ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.7 }}
            style={{ textAlign:"center", marginBottom:"8px" }}
          >
            <p className="section-label">
              <span style={{ width:24, height:1, background:gold, display:"inline-block" }} />
              Platform Capabilities
              <span style={{ width:24, height:1, background:gold, display:"inline-block" }} />
            </p>
            <h2 className="section-heading">
              Explore What <em>LeafLine</em> Offers
            </h2>
            <p className="section-sub">
              A comprehensive academic platform designed to elevate your study
              experience through intelligent tools, structured resources, and
              collaborative learning.
            </p>
          </motion.div>

          <Divider />

          {/* ── Cards Grid ─────────────────────────────────────────── */}
          <div className="cat-grid">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                className="cat-card"
                data-aos="fade-up"
                data-aos-delay={index * 120}
                initial={{ opacity:0, y:24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.55, delay: index * 0.12 }}
              >
                <div className="cat-icon-wrap">{cat.icon}</div>
                <h3 className="cat-title">{cat.title}</h3>
                <p className="cat-desc">{cat.desc}</p>
                <span className="cat-roman">{cat.roman}</span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}