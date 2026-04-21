import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, User, MessageSquare, Building2 } from "lucide-react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import MapSection from "./Map";

/* ─── Contact info cards ────────────────────────────────────────────── */
const contactDetails = [
  {
    icon: <Mail size={18} strokeWidth={1.5} />,
    label: "Email Address",
    value: "support@leafline.app",
    href: "mailto:support@leafline.app",
  },
  {
    icon: <Phone size={18} strokeWidth={1.5} />,
    label: "Phone Number",
    value: "+234 708 676 8271",
    href: "tel:+2347086768271",
  },
  {
    icon: <MapPin size={18} strokeWidth={1.5} />,
    label: "Office Location",
    value: "Abuja, Nigeria",
    href: "#map",
  },
];

const industries = [
  { value: "", label: "Select your field of study" },
  { value: "tech", label: "Technology & Computer Science" },
  { value: "edu", label: "Education & Humanities" },
  { value: "med", label: "Medical & Life Sciences" },
  { value: "eng", label: "Engineering & Applied Sciences" },
  { value: "bus", label: "Business & Social Sciences" },
  { value: "other", label: "Other" },
];

/* ─── Shared input class ────────────────────────────────────────────── */
const inputClass = `
  w-full bg-white border border-amber-200/60
  hover:border-amber-400/60 focus:border-amber-500
  focus:outline-none focus:ring-2 focus:ring-amber-400/20
  rounded-sm px-4 text-[#0D1F3C] text-sm font-light
  placeholder:text-slate-400
  font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif]
  transition-all duration-200
`;

/* ─── Field wrapper with icon ───────────────────────────────────────── */
const Field = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/70 pointer-events-none">
      {icon}
    </span>
    <div className="pl-11">{children}</div>
  </div>
);

const Contact = () => {
  const [form, setForm] = useState({
    name: "", email: "", industry: "", message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received. Our team will be in touch shortly.");
    setForm({ name: "", email: "", industry: "", message: "" });
  };

  return (
    <div className="font-['Source_Sans_3',_'Source_Sans_Pro',_sans-serif] bg-white text-[#0D1F3C]">
      <Navbar />

      {/* ── Hero Header ────────────────────────────────────────────── */}
      <div className="relative bg-[#0D1F3C] pt-36 pb-24 px-6 md:px-16 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Gold top rule */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />
        {/* Corner brackets */}
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-400/30" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-400/30" />

        <motion.div
          className="max-w-3xl relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-amber-500 mb-4">
            <span className="inline-block w-6 h-px bg-amber-500" />
            Get in Touch
          </p>
          <h1 className="font-['Georgia',_serif] text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.1] mb-5">
            Let's Discuss Your{" "}
            <em className="text-amber-400 not-italic">Academic Needs</em>
          </h1>
          <div className="w-14 h-[2px] bg-amber-500 mb-6" />
          <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed max-w-xl">
            Whether you're a student seeking guidance or an educator exploring
            collaboration tools — our team is ready to assist you.
          </p>
        </motion.div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <section className="relative px-6 md:px-16 py-20 bg-[#F7F4EE]">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(196,154,42,0.04) 47px, rgba(196,154,42,0.04) 48px),
              repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(196,154,42,0.04) 47px, rgba(196,154,42,0.04) 48px)
            `,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* ── Left: Info ─────────────────────────────────────── */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-amber-600 mb-3 flex items-center gap-2">
                  <span className="inline-block w-5 h-px bg-amber-500" />
                  Contact Information
                </p>
                <h2 className="font-['Georgia',_serif] text-2xl md:text-3xl font-bold text-[#0D1F3C] leading-tight mb-3">
                  We're Here to <em className="not-italic text-[#163061]">Help</em>
                </h2>
                <div className="w-10 h-[2px] bg-amber-500 mb-5" />
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  Reach out through any of the channels below or complete the
                  contact form. We endeavour to respond within one business day.
                </p>
              </div>

              {/* Contact cards */}
              <div className="space-y-4">
                {contactDetails.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="
                      group flex items-center gap-4
                      bg-white border border-amber-200/40
                      hover:border-amber-400/50
                      rounded-sm px-5 py-4
                      transition-all duration-250
                      hover:shadow-[0_4px_20px_rgba(13,31,60,0.07)]
                      hover:-translate-y-0.5
                      no-underline
                    "
                  >
                    {/* Icon box */}
                    <span className="
                      w-10 h-10 flex items-center justify-center flex-shrink-0
                      bg-[#F7F4EE] border border-amber-300/40
                      group-hover:bg-[#0D1F3C] group-hover:border-[#0D1F3C]
                      group-hover:text-amber-400 text-[#0D1F3C]
                      rounded-sm transition-all duration-250
                    ">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-600 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-[#0D1F3C] text-sm font-semibold">
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Office hours */}
              <div className="bg-[#0D1F3C] rounded-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500" />
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-500 mb-3">
                  Support Hours
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM WAT" },
                    { day: "Saturday",        time: "10:00 AM – 2:00 PM WAT" },
                    { day: "Sunday",          time: "Closed" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between gap-4">
                      <span className="text-slate-400 font-light">{row.day}</span>
                      <span className="text-white font-semibold">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Right: Form ────────────────────────────────────── */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="bg-white border border-amber-200/40 rounded-sm p-8 md:p-10 relative overflow-hidden">
                {/* Corner TL */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/30" />
                {/* Corner BR */}
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/30" />

                <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-amber-600 mb-2">
                  Send a Message
                </p>
                <h3 className="font-['Georgia',_serif] text-2xl font-bold text-[#0D1F3C] mb-1">
                  Complete the Form Below
                </h3>
                <div className="w-8 h-[1.5px] bg-amber-500 mb-8" />

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <Field icon={<User size={15} strokeWidth={1.5} />}>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className={`${inputClass} h-12 pl-4`}
                      style={{ paddingLeft: "1rem" }}
                    />
                  </Field>

                  {/* Email */}
                  <Field icon={<Mail size={15} strokeWidth={1.5} />}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Institutional or Personal Email"
                      required
                      className={`${inputClass} h-12 pl-4`}
                      style={{ paddingLeft: "1rem" }}
                    />
                  </Field>

                  {/* Industry */}
                  <Field icon={<Building2 size={15} strokeWidth={1.5} />}>
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className={`${inputClass} h-12 pl-4 cursor-pointer appearance-none`}
                      style={{ paddingLeft: "1rem" }}
                    >
                      {industries.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field icon={<MessageSquare size={15} strokeWidth={1.5} />}>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we assist you?"
                      rows={5}
                      required
                      className={`${inputClass} pt-3 pl-4 resize-none`}
                      style={{ paddingLeft: "1rem" }}
                    />
                  </Field>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="
                      w-full h-12 flex items-center justify-center gap-3
                      bg-[#0D1F3C] hover:bg-[#163061]
                      text-amber-400 font-semibold text-xs
                      tracking-[0.18em] uppercase rounded-sm
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:shadow-[0_8px_28px_rgba(13,31,60,0.22)]
                    "
                  >
                    <Send size={15} strokeWidth={2} />
                    Submit Enquiry
                  </button>

                  <p className="text-center text-slate-400 text-xs font-light">
                    We respect your privacy. Your details will never be shared with third parties.
                  </p>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────────── */}
      <MapSection />
      <Footer />
    </div>
  );
};

export default Contact;