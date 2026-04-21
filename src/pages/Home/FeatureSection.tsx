import { BookOpen, Users, FileText } from "lucide-react";
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
const muted   = "#8A9BB0";

const features = [
  {
    icon: <BookOpen strokeWidth={1.5} size={26} />,
    number: "01",
    title: "Organised Learning",
    description:
      "Maintain a structured record of your courses, annotated notes, and academic progress — all consolidated within a single, intuitive interface.",
  },
  {
    icon: <Users strokeWidth={1.5} size={26} />,
    number: "02",
    title: "Study Communities",
    description:
      "Engage with a network of scholars, exchange curated resources, and cultivate a collaborative environment that accelerates mutual academic growth.",
  },
  {
    icon: <FileText strokeWidth={1.5} size={26} />,
    number: "03",
    title: "Resource Library",
    description:
      "Browse a curated repository of peer-shared PDFs, research documents, and study guides vetted for academic rigour and reliability.",
  },
];

/* ─── Thin ornament divider ─────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"0 auto 48px", maxWidth:320 }}>
    <div style={{ flex:1, height:"1px", background:`rgba(196,154,42,0.25)` }} />
    <div style={{ width:6, height:6, background:gold, transform:"rotate(45deg)", opacity:0.7 }} />
    <div style={{ flex:1, height:"1px", background:`rgba(196,154,42,0.25)` }} />
  </div>
);

export default function FeatureSection() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Source+Sans+3:wght@300;400;600&display=swap');

        .feat-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(196,154,42,0.18);
          border-radius: 3px;
          padding: 40px 36px 44px;
          overflow: hidden;
          transition: box-shadow 0.28s ease, transform 0.28s ease;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .feat-card:hover {
          box-shadow: 0 16px 48px rgba(13,31,60,0.1);
          transform: translateY(-5px);
        }

        /* Animated gold fill on hover */
        .feat-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, ${gold}, ${navyMid});
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .feat-card:hover::before { transform: scaleX(1); }

        /* Faint diagonal watermark stripe */
        .feat-card::after {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,154,42,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .feat-number {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 72px;
          font-weight: 700;
          color: ${navy};
          opacity: 0.05;
          position: absolute;
          top: 12px;
          right: 20px;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          letter-spacing: -2px;
        }

        .feat-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 2px;
          background: ${cream};
          border: 1px solid rgba(196,154,42,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${navy};
          margin-bottom: 24px;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .feat-card:hover .feat-icon-wrap {
          background: ${navy};
          border-color: ${navy};
          color: ${gold};
        }
        .feat-card:hover .feat-icon-wrap svg { color: ${gold}; }

        .feat-rule {
          width: 32px;
          height: 1.5px;
          background: ${gold};
          margin-bottom: 16px;
          transition: width 0.3s ease;
        }
        .feat-card:hover .feat-rule { width: 56px; }

        .feat-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: ${navy};
          margin: 0 0 14px;
          line-height: 1.2;
        }

        .feat-desc {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 14.5px;
          color: ${slate};
          line-height: 1.78;
          font-weight: 300;
          margin: 0;
          flex: 1;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 580px) {
          .feat-grid { grid-template-columns: 1fr; }
        }

        .feat-section-label {
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

        .feat-section-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(32px, 4.5vw, 50px);
          font-weight: 700;
          color: ${navy};
          line-height: 1.1;
          margin: 0 0 20px;
          text-align: center;
        }
        .feat-section-heading em {
          font-style: italic;
          color: ${navyMid};
        }

        .feat-section-sub {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 16px;
          color: ${slate};
          font-weight: 300;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 40px;
          text-align: center;
        }
      `}</style>

      <section style={{
        padding: "96px 24px",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Subtle background grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents:"none",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(196,154,42,0.04) 47px, rgba(196,154,42,0.04) 48px),
            repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(196,154,42,0.04) 47px, rgba(196,154,42,0.04) 48px)
          `,
        }} />

        {/* Navy side accent bar */}
        <div style={{
          position:"absolute", top:"10%", bottom:"10%", left:0,
          width:4,
          background:`linear-gradient(to bottom, transparent, ${gold}, transparent)`,
          opacity:0.4,
        }} />

        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1 }}>

          {/* ── Section Header ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.7 }}
            style={{ textAlign:"center", marginBottom:"8px" }}
          >
            <p className="feat-section-label">
              <span style={{ width:24, height:1, background:gold, display:"inline-block" }} />
              Core Features
              <span style={{ width:24, height:1, background:gold, display:"inline-block" }} />
            </p>

            <h2 className="feat-section-heading">
              Why Choose <em>LeafLine?</em>
            </h2>

            <p className="feat-section-sub">
              Everything you need to organise your learning, connect with peers,
              and achieve sustained academic excellence — in one refined platform.
            </p>
          </motion.div>

          <Divider />

          {/* ── Feature Cards ───────────────────────────────────────── */}
          <div className="feat-grid">
            {features.map((feat, index) => (
              <motion.div
                key={index}
                className="feat-card"
                data-aos="fade-up"
                data-aos-delay={index * 120}
                initial={{ opacity:0, y:28 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.55, delay: index * 0.13 }}
              >
                <span className="feat-number">{feat.number}</span>

                <div className="feat-icon-wrap">{feat.icon}</div>

                <div className="feat-rule" />

                <h3 className="feat-title">{feat.title}</h3>
                <p className="feat-desc">{feat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Bottom quote strip ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ duration:0.8, delay:0.4 }}
            style={{
              marginTop: "64px",
              padding: "32px 40px",
              background: navy,
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* gold left accent */}
            <div style={{ position:"absolute", top:0, bottom:0, left:0, width:4, background:gold }} />

            <div>
              <p style={{
                fontFamily:"'Cormorant Garamond', Georgia, serif",
                fontSize:"clamp(18px, 2.5vw, 24px)",
                fontWeight:600,
                color:"#FFFFFF",
                margin:"0 0 6px",
                fontStyle:"italic",
              }}>
                "Knowledge is the foundation of every great institution."
              </p>
              <p style={{
                fontFamily:"'Source Sans 3', sans-serif",
                fontSize:"12px",
                letterSpacing:"2px",
                textTransform:"uppercase",
                color: gold,
                margin:0,
                fontWeight:600,
              }}>
                The LeafLine Principle
              </p>
            </div>

            <a
              href="/auth/signup"
              style={{
                fontFamily:"'Source Sans 3', sans-serif",
                fontSize:"12px",
                fontWeight:600,
                letterSpacing:"2px",
                textTransform:"uppercase",
                color: gold,
                background:"transparent",
                border:`1.5px solid ${gold}`,
                padding:"11px 28px",
                borderRadius:"2px",
                textDecoration:"none",
                flexShrink:0,
                transition:"background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = gold;
                (e.currentTarget as HTMLAnchorElement).style.color = navy;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = gold;
              }}
            >
              Get Started
            </a>
          </motion.div>

        </div>
      </section>
    </>
  );
}