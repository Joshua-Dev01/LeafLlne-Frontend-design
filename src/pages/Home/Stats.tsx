import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({ once: true, duration: 900 });

const stats = [
  {
    id: 1,
    value: 1200,
    suffix: "+",
    label: "Uploaded Notes",
    subLabel: "Peer-shared academic PDFs",
    roman: "I",
    animation: "fade-up",
    delay: 0,
  },
  {
    id: 2,
    value: 350,
    suffix: "+",
    label: "Collaborations",
    subLabel: "Group projects & study teams",
    roman: "II",
    animation: "fade-up",
    delay: 100,
  },
  {
    id: 3,
    value: 800,
    suffix: "+",
    label: "Tests Taken",
    subLabel: "Practice assessments completed",
    roman: "III",
    animation: "fade-up",
    delay: 200,
  },
  {
    id: 4,
    value: 5000,
    suffix: "+",
    label: "Active Students",
    subLabel: "Engaged learners on platform",
    roman: "IV",
    animation: "fade-up",
    delay: 300,
  },
];

/* ─── Individual Stat Card ─────────────────────────────────────────── */
interface StatProps {
  value: number;
  suffix: string;
  label: string;
  subLabel: string;
  roman: string;
  animation: string;
  delay: number;
}

const StatCard: React.FC<StatProps> = ({
  value, suffix, label, subLabel, roman, animation, delay,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div
      ref={ref}
      data-aos={animation}
      data-aos-delay={delay}
      className="
        group relative bg-white border border-amber-200/60
        rounded-sm p-8 text-center overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(13,31,60,0.10)]
        hover:border-amber-400/40
      "
    >
      {/* Top gold border that expands on hover */}
      <div className="
        absolute top-0 left-0 right-0 h-[3px]
        bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600
        scale-x-0 group-hover:scale-x-100
        transition-transform duration-500 origin-left
      " />

      {/* Static thin top line (always visible) */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-amber-300/30" />

      {/* Faded roman numeral watermark */}
      <span className="
        absolute bottom-2 right-4
        font-['Georgia',_serif] text-7xl font-bold
        text-[#0D1F3C] opacity-[0.04]
        select-none pointer-events-none leading-none
        tracking-tighter
      ">
        {roman}
      </span>

      {/* Radial glow top-right */}
      <div className="
        absolute -top-6 -right-6 w-24 h-24 rounded-full
        bg-amber-400/5 pointer-events-none
      " />

      {/* Corner bracket TL */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-400/40" />
      {/* Corner bracket BR */}
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-400/40" />

      {/* Count */}
      <p className="
        font-['Georgia',_serif] text-5xl font-bold
        text-[#0D1F3C] leading-none mb-4 tracking-tight
      ">
        {inView ? <CountUp end={value} duration={2.8} separator="," /> : "0"}
        <span className="text-amber-600">{suffix}</span>
      </p>

      {/* Gold rule */}
      <div className="
        w-8 h-[2px] bg-amber-500 mx-auto mb-4
        transition-all duration-300 group-hover:w-14
      " />

      {/* Label */}
      <p className="
        font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif]
        text-xs font-semibold tracking-[0.2em] uppercase
        text-[#0D1F3C] mb-2
      ">
        {label}
      </p>

      {/* Sub label */}
      <p className="
        font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif]
        text-sm text-slate-500 font-light leading-relaxed
      ">
        {subLabel}
      </p>
    </div>
  );
};

/* ─── Stats Section ────────────────────────────────────────────────── */
const Stats: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F7F4EE] py-24 px-6 overflow-hidden border-t border-b border-amber-200/30">

      {/* Dot grid left accent */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-48 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.4) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {/* Dot grid right accent */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-48 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.4) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ────────────────────────────────────────── */}
        <div className="text-center mb-14" data-aos="fade-up">

          {/* Label */}
          <p className="
            flex items-center justify-center gap-3
            font-['Source_Sans_3',_sans-serif] text-[11px] font-semibold
            tracking-[0.25em] uppercase text-amber-600 mb-4
          ">
            <span className="inline-block w-6 h-px bg-amber-500" />
            By the Numbers
            <span className="inline-block w-6 h-px bg-amber-500" />
          </p>

          {/* Heading */}
          <h2 className="
            font-['Georgia',_serif] font-bold text-[#0D1F3C]
            text-4xl md:text-5xl leading-tight mb-5
          ">
            A Growing Academic{" "}
            <em className="text-[#163061] font-semibold not-italic">Community</em>
          </h2>

          {/* Gold rule */}
          <div className="w-12 h-[2px] bg-amber-500 mx-auto mb-5" />

          <p className="
            font-['Source_Sans_3',_sans-serif] font-light text-slate-500
            text-base md:text-lg max-w-lg mx-auto leading-relaxed
          ">
            Real numbers that reflect the trust students place in LeafLine
            as their academic companion.
          </p>
        </div>

        {/* ── Cards Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* ── Bottom note ──────────────────────────────────────────── */}
        <p
          className="
            text-center mt-12
            font-['Source_Sans_3',_sans-serif] text-xs
            tracking-[0.2em] uppercase text-slate-400 font-light
          "
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Statistics updated monthly · Growing every semester
        </p>

      </div>
    </section>
  );
};

export default Stats;