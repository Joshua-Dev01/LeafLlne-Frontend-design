import React from "react";
import { Link } from "react-router-dom";
import AboutUsIllustration from "../../assets/heroImg.png";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/footer/Footer";
import FAQSection from "./FAQSection";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, Target } from "lucide-react";

/* ─── Values Data ───────────────────────────────────────────────────── */
const values = [
  {
    icon: <BookOpen size={22} strokeWidth={1.5} />,
    title: "Knowledge First",
    desc: "We believe access to quality study material should be universal, structured, and always within reach.",
  },
  {
    icon: <Users size={22} strokeWidth={1.5} />,
    title: "Collaborative Growth",
    desc: "Learning accelerates when students share insights, challenge each other, and build understanding together.",
  },
  {
    icon: <Award size={22} strokeWidth={1.5} />,
    title: "Academic Integrity",
    desc: "Every resource on LeafLine is peer-vetted, promoting rigour, honesty, and scholarly standards.",
  },
  {
    icon: <Target size={22} strokeWidth={1.5} />,
    title: "Student-Centred",
    desc: "Every feature is designed around one question: does this genuinely help students succeed?",
  },
];

/* ─── Ornamental Divider ────────────────────────────────────────────── */
// const Divider = () => (
//   <div className="flex items-center gap-3 my-6">
//     <div className="flex-1 h-px bg-amber-400/30" />
//     <div className="w-1.5 h-1.5 bg-amber-500 rotate-45 opacity-70" />
//     <div className="flex-1 h-px bg-amber-400/30" />
//   </div>
// );

const AboutUs: React.FC = () => {
  return (
    <div className="font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif] bg-white text-[#0D1F3C]">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-white overflow-hidden pt-8">

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-100 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(196,154,42,0.05) 47px, rgba(196,154,42,0.05) 48px),
              repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(196,154,42,0.05) 47px, rgba(196,154,42,0.05) 48px)
            `,
          }}
        />

        {/* Top gold accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 md:px-16 pt-28 pb-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

            {/* ── Left: Text ────────────────────────────────────── */}
            <motion.div
              className="max-w-xl w-full"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Label */}
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-amber-600 mb-4">
                <span className="inline-block w-6 h-px bg-amber-500" />
                Our Story
              </p>

              {/* Heading */}
              <h1 className="font-['Georgia',_serif] text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.1] text-[#0D1F3C] mb-2">
                Built for the{" "}
                <em className="text-[#163061] not-italic">Modern Scholar</em>
              </h1>

              {/* Gold rule */}
              <div className="w-14 h-[2px] bg-amber-500 mt-5 mb-6" />

              {/* Body */}
              <p className="text-slate-600 text-base md:text-[17px] font-light leading-relaxed mb-4">
                LeafLine is your modern academic hub — a platform designed to help
                students collaborate, share knowledge, and grow together
                intellectually. From organising PDF study materials to running
                AI-powered practice assessments, LeafLine makes learning
                <strong className="font-semibold text-[#0D1F3C]"> smarter, not harder.</strong>
              </p>
              <p className="text-slate-500 text-base font-light leading-relaxed mb-8">
                We believe education thrives when knowledge is shared openly.
                That is the principle LeafLine was founded upon, and it guides
                every decision we make as a platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/auth/signup"
                  className="
                    px-7 py-3.5 bg-[#0D1F3C] hover:bg-[#163061]
                    text-amber-400 font-semibold text-xs
                    tracking-[0.15em] uppercase rounded-sm
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.2)]
                    no-underline
                  "
                >
                  Join LeafLine
                </Link>
                <Link
                  to="/contact"
                  className="
                    px-7 py-3.5
                    border border-[#0D1F3C]/30 hover:border-[#0D1F3C]
                    text-[#0D1F3C] font-semibold text-xs
                    tracking-[0.15em] uppercase rounded-sm
                    transition-all duration-200 hover:bg-[#0D1F3C]/5
                    no-underline
                  "
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            {/* ── Right: Image ──────────────────────────────────── */}
            <motion.div
              className="relative flex justify-center w-full lg:w-auto"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            >
              {/* Dot grid behind image */}
              <div
                className="absolute -top-6 -left-6 w-40 h-40 opacity-50 pointer-events-none z-0"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.5) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
              <div
                className="absolute -bottom-6 -right-6 w-40 h-40 opacity-50 pointer-events-none z-0"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.5) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* Frame */}
              <div className="relative z-10 p-3 border border-amber-300/40 rounded-sm bg-[#F7F4EE]">
                {/* Corner TL */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400/50" />
                {/* Corner BR */}
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400/50" />

                <motion.img
                  src={AboutUsIllustration}
                  alt="LeafLine Academic Platform"
                  className="w-full max-w-sm md:max-w-md object-contain drop-shadow-xl rounded-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Mission Strip ────────────────────────────────────────── */}
      <section className="bg-[#0D1F3C] px-6 md:px-16 py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-['Georgia',_serif] text-white text-xl md:text-2xl lg:text-3xl font-semibold italic leading-relaxed mb-4">
            "Our mission is to make collaborative, structured learning accessible
            to every student — regardless of institution or geography."
          </p>
          <p className="text-amber-500 text-xs font-semibold tracking-[0.25em] uppercase">
            — The LeafLine Mission Statement
          </p>
        </motion.div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────── */}
      <section className="bg-[#F7F4EE] px-6 md:px-16 py-24 border-t border-b border-amber-200/30">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-amber-600 mb-4">
              <span className="inline-block w-6 h-px bg-amber-500" />
              What We Stand For
              <span className="inline-block w-6 h-px bg-amber-500" />
            </p>
            <h2 className="font-['Georgia',_serif] text-4xl md:text-5xl font-bold text-[#0D1F3C] leading-tight mb-4">
              Our Core <em className="text-[#163061] not-italic">Values</em>
            </h2>
            <div className="w-12 h-[2px] bg-amber-500 mx-auto" />
          </motion.div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                className="
                  group relative bg-white border border-amber-200/50
                  border-t-[3px] border-t-amber-500
                  rounded-sm p-8 overflow-hidden
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(13,31,60,0.09)]
                "
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Faded number */}
                <span className="absolute bottom-2 right-4 font-['Georgia',_serif] text-7xl font-bold text-[#0D1F3C] opacity-[0.04] select-none leading-none">
                  {i + 1}
                </span>

                {/* Icon */}
                <div className="
                  w-11 h-11 flex items-center justify-center
                  bg-[#F7F4EE] border border-amber-300/40
                  rounded-sm mb-5 text-[#0D1F3C]
                  group-hover:bg-[#0D1F3C] group-hover:text-amber-400
                  transition-all duration-250
                ">
                  {v.icon}
                </div>

                {/* Rule */}
                <div className="w-8 h-[1.5px] bg-amber-500 mb-4 transition-all duration-300 group-hover:w-14" />

                <h3 className="font-['Georgia',_serif] text-[#0D1F3C] text-lg font-bold mb-3">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team / Stats Strip ───────────────────────────────────── */}
      <section className="bg-white px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-amber-200/30">
            {[
              { value: "5,000+", label: "Active Students", sub: "And growing every semester" },
              { value: "1,200+", label: "Study Resources", sub: "Peer-reviewed & curated" },
              { value: "350+",   label: "Collaborations",  sub: "Group projects launched" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-white text-center px-10 py-14 border border-amber-200/30"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <p className="font-['Georgia',_serif] text-5xl font-bold text-[#0D1F3C] mb-2">
                  {stat.value}
                </p>
                <div className="w-8 h-[1.5px] bg-amber-500 mx-auto mb-3" />
                <p className="text-[#0D1F3C] text-sm font-semibold tracking-wide uppercase mb-1">
                  {stat.label}
                </p>
                <p className="text-slate-400 text-xs font-light">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ & Footer ─────────────────────────────────────────── */}
      <FAQSection />
      <Footer />
    </div>
  );
};

export default AboutUs;