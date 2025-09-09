import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import "aos/dist/aos.css";
import AOS from "aos";

// initialize AOS on load
AOS.init();

const stats = [
  {
    id: 1,
    value: 1200,
    suffix: "+",
    label: "UPLOADED NOTES",
    subLabel: "PDFs shared by students",
    color: "text-blue-500",
    animation: "fade-right",
  },
  {
    id: 2,
    value: 350,
    suffix: "+",
    label: "COLLABORATIONS",
    subLabel: "Group projects & study teams",
    color: "text-purple-500",
    animation: "fade-up",
  },
  {
    id: 3,
    value: 800,
    suffix: "+",
    label: "TESTS TAKEN",
    subLabel: "Practice quizzes completed",
    color: "text-teal-500",
    animation: "fade-left",
  },
  {
    id: 4,
    value: 5000,
    suffix: "+",
    label: "ACTIVE STUDENTS",
    subLabel: "Engaged learners on platform",
    color: "text-pink-500",
    animation: "fade-up",
  },
];

const Stats: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-sky-100 via-white to-violet-50 py-16 flex justify-center font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl w-full px-6 text-center">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
    </div>
  );
};

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  subLabel: string;
  color: string;
  animation: string;
}

const StatCard: React.FC<StatProps> = ({ value, suffix, label, subLabel, color, animation }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      data-aos={animation}
      data-aos-duration="1200"
      className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl shadow-lg p-8"
    >
      <h2 className={`text-4xl font-bold ${color}`}>
        {inView ? <CountUp end={value} duration={3} /> : 0}
        {suffix}
      </h2>
      <p className="font-semibold text-gray-800 mt-2">{label}</p>
      <p className="text-gray-600 text-sm">{subLabel}</p>
    </div>
  );
};

export default Stats;
