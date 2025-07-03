import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    BookOpen,
    Users,
    Clock,
    Globe2
} from "lucide-react"; // 👈 Icons

import { motion } from "framer-motion";

const stats = [
    { label: "Books Read Globally", value: 120000, icon: BookOpen },
    { label: "Active Readers", value: 30000, icon: Users },
    { label: "Avg Reading Time (mins)", value: 45, icon: Clock },
    { label: "Countries Reached", value: 62, icon: Globe2 },
];

const StatsSection = () => {
    const [hasViewed, setHasViewed] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        if (inView) setHasViewed(true);
    }, [inView]);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-b from-blue-50 to-white px-6 md:px-20"
        >
            <p
                className="text-3xl font-bold text-center text-[#0d0c22] !mb-12"
                data-aos="fade-up"
            >
                LeafLine Global Stats
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                            className="bg-white shadow-2xl p-6 rounded-xl flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-300"
                        >
                            <Icon size={36} className="text-white font-bold bg-[#0d0c22] rounded-full p-1" />
                            <p className="text-4xl font-bold">
                                {hasViewed ? (
                                    <CountUp end={stat.value} duration={2} separator="," />
                                ) : (
                                    0
                                )}
                                {stat.label.includes("mins") ? "" : "+"}
                            </p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default StatsSection;
