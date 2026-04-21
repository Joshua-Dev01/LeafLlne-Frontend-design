import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/* ─── FAQ Data ──────────────────────────────────────────────────────── */
const faqs = [
  {
    key: "1",
    question: "What is LeafLine Study Hub?",
    answer:
      "LeafLine is your digital academic companion — offering curated study resources, AI-powered assessments, and collaboration tools purpose-built to help students achieve scholarly excellence.",
  },
  {
    key: "2",
    question: "How do I get started on LeafLine?",
    answer:
      "Create a free account, select your subjects and areas of study, and immediately begin exploring personalised resources, practice tests, and peer study groups.",
  },
  {
    key: "3",
    question: "Is LeafLine free to use?",
    answer:
      "Yes. LeafLine provides free access to all core features. Premium membership unlocks advanced analytics, unlimited resource uploads, and priority collaboration tools.",
  },
  {
    key: "4",
    question: "Can I track my academic progress?",
    answer:
      "Absolutely. Our intelligent dashboard monitors your study time, completed assessments, and performance trends — giving you a clear view of your academic development over time.",
  },
  {
    key: "5",
    question: "Can I collaborate with peers on LeafLine?",
    answer:
      "Yes. Join structured study groups, annotate and share notes, and engage in scholarly discourse with fellow students across disciplines and institutions.",
  },
  {
    key: "6",
    question: "How are study resources vetted for quality?",
    answer:
      "All resources uploaded to LeafLine go through a peer-review process and community rating system, ensuring only accurate, rigorous, and academically sound materials reach our library.",
  },
];

/* ─── Single FAQ Item ───────────────────────────────────────────────── */
const FAQItem = ({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.07 }}
    className={`
      group border rounded-sm overflow-hidden
      transition-all duration-300
      ${isOpen
        ? "border-amber-400/50 shadow-[0_8px_32px_rgba(13,31,60,0.08)]"
        : "border-amber-200/40 hover:border-amber-300/60 hover:shadow-[0_4px_16px_rgba(13,31,60,0.05)]"
      }
    `}
  >
    {/* Question row */}
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-6 px-8 py-6 bg-white text-left"
    >
      {/* Number + question */}
      <div className="flex items-center gap-5 min-w-0">
        <span className="
          font-['Georgia',_serif] text-sm font-bold text-amber-500
          opacity-70 flex-shrink-0 w-6 text-right
        ">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="
          font-['Georgia',_serif] text-[#0D1F3C] font-semibold
          text-base md:text-lg leading-snug
        ">
          {item.question}
        </span>
      </div>

      {/* Icon */}
      <span className={`
        flex-shrink-0 w-8 h-8 flex items-center justify-center
        border rounded-sm transition-all duration-250
        ${isOpen
          ? "bg-[#0D1F3C] border-[#0D1F3C] text-amber-400"
          : "border-amber-300/50 text-[#0D1F3C] group-hover:border-amber-400 group-hover:text-amber-600"
        }
      `}>
        {isOpen
          ? <Minus size={14} strokeWidth={2} />
          : <Plus size={14} strokeWidth={2} />
        }
      </span>
    </button>

    {/* Answer */}
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="bg-[#F7F4EE] border-t border-amber-200/40">
            {/* Gold left accent bar */}
            <div className="flex">
              <div className="w-1 bg-amber-500 flex-shrink-0" />
              <p className="
                font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif]
                text-slate-600 text-base font-light leading-relaxed
                px-12 py-6
              ">
                {item.answer}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ─── FAQ Section ───────────────────────────────────────────────────── */
export default function FAQSection() {
  const [openKey, setOpenKey] = useState<string | null>("1");

  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  return (
    <section className="relative bg-white py-24 px-6 md:px-16 border-t border-amber-200/30 overflow-hidden">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(196,154,42,0.04) 47px, rgba(196,154,42,0.04) 48px),
            repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(196,154,42,0.04) 47px, rgba(196,154,42,0.04) 48px)
          `,
        }}
      />

      {/* Right side gold bar */}
      <div className="absolute top-1/4 bottom-1/4 right-0 w-1 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── Section Header ──────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-amber-600 mb-4 font-['Source_Sans_3',_sans-serif]">
            <span className="inline-block w-6 h-px bg-amber-500" />
            Have Questions?
            <span className="inline-block w-6 h-px bg-amber-500" />
          </p>

          <h2 className="font-['Georgia',_serif] text-4xl md:text-5xl font-bold text-[#0D1F3C] leading-tight mb-5">
            Frequently Asked{" "}
            <em className="text-[#163061] not-italic">Questions</em>
          </h2>

          <div className="w-12 h-[2px] bg-amber-500 mx-auto mb-6" />

          <p className="font-['Source_Sans_3',_sans-serif] text-slate-500 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about LeafLine — answered clearly and
            concisely for prospective and current students alike.
          </p>
        </motion.div>

        {/* ── FAQ Items ───────────────────────────────────────────── */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.key}
              item={item}
              index={i}
              isOpen={openKey === item.key}
              onToggle={() => toggle(item.key)}
            />
          ))}
        </div>

        {/* ── Bottom CTA nudge ────────────────────────────────────── */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="font-['Source_Sans_3',_sans-serif] text-slate-500 font-light text-sm">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="
              font-['Source_Sans_3',_sans-serif]
              text-sm font-semibold tracking-[0.12em] uppercase
              text-amber-600 border-b border-amber-400
              hover:text-[#0D1F3C] hover:border-[#0D1F3C]
              transition-colors duration-200 pb-px
            "
          >
            Reach Our Support Team →
          </a>
        </motion.div>

      </div>
    </section>
  );
}