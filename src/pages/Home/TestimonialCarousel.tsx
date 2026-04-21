import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import 'swiper/css';

const testimonials = [
  {
    name: 'John Doe',
    role: 'BSc Computer Science, Year 3',
    avatar: 'https://i.pravatar.cc/100?img=1',
    message:
      'LeafLine completely transformed how I approach my studies. The organised resource library alone has saved me countless hours each semester.',
    rating: 5,
  },
  {
    name: 'Jane Smith',
    role: 'MA Literature, Postgraduate',
    avatar: 'https://i.pravatar.cc/100?img=2',
    message:
      'I have discovered an incredible breadth of academic material through LeafLine. It feels purpose-built for serious students.',
    rating: 4,
  },
  {
    name: 'Michael Brown',
    role: 'BEng Mechanical Engineering, Year 2',
    avatar: 'https://i.pravatar.cc/100?img=3',
    message:
      'Refined, intuitive, and genuinely effective. LeafLine has become an indispensable part of my academic workflow.',
    rating: 5,
  },
  {
    name: 'Sophia Green',
    role: 'BSc Biology, Year 4',
    avatar: 'https://i.pravatar.cc/100?img=4',
    message:
      'The AI practice tests are exceptional. My exam results have improved markedly since I began using LeafLine consistently.',
    rating: 5,
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="relative w-full bg-[#0D1F3C] py-24 px-6 overflow-hidden">

      {/* ── Background textures ───────────────────────────────────── */}
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(196,154,42,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Bottom gold gradient bleed */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40" />
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-amber-400/20" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Section Header ──────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Label */}
          <p className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4 font-['Source_Sans_3',_sans-serif]">
            <span className="inline-block w-6 h-px bg-amber-500" />
            Student Testimonials
            <span className="inline-block w-6 h-px bg-amber-500" />
          </p>

          {/* Heading */}
          <h2 className="font-['Georgia',_serif] font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
            What Our{' '}
            <em className="text-amber-400 not-italic font-semibold">Scholars</em>{' '}
            Say
          </h2>

          {/* Gold rule */}
          <div className="w-12 h-[2px] bg-amber-500 mx-auto mb-5" />

          <p className="font-['Source_Sans_3',_sans-serif] font-light text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Hear from students who have made LeafLine a cornerstone of their academic journey.
          </p>
        </motion.div>

        {/* ── Carousel ────────────────────────────────────────────── */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: '.ll-swiper-next',
              prevEl: '.ll-swiper-prev',
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-2"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i} className="h-auto">
                <motion.div
                  className="
                    group relative bg-white/[0.04] border border-white/10
                    hover:border-amber-400/30 hover:bg-white/[0.07]
                    rounded-sm p-8 h-full flex flex-col
                    transition-all duration-300
                    hover:-translate-y-1
                  "
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  {/* Gold top accent on hover */}
                  <div className="
                    absolute top-0 left-0 right-0 h-[2px]
                    bg-gradient-to-r from-amber-600 to-amber-400
                    scale-x-0 group-hover:scale-x-100
                    transition-transform duration-500 origin-left
                  " />

                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-400/25" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-400/25" />

                  {/* Quote icon */}
                  <div className="mb-6">
                    <Quote size={28} className="text-amber-500 opacity-60" strokeWidth={1.5} />
                  </div>

                  {/* Message */}
                  <p className="
                    font-['Georgia',_serif] text-white/80 text-[15px]
                    leading-relaxed italic flex-1 mb-6
                  ">
                    "{t.message}"
                  </p>

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        fill={idx < t.rating ? '#f59e0b' : 'none'}
                        stroke={idx < t.rating ? '#f59e0b' : 'rgba(255,255,255,0.2)'}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10 mb-5" />

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-sm object-cover border border-amber-400/30"
                      />
                      {/* tiny gold corner */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-amber-400/60" />
                    </div>
                    <div>
                      <p className="
                        font-['Source_Sans_3',_sans-serif] font-semibold
                        text-white text-sm tracking-wide
                      ">
                        {t.name}
                      </p>
                      <p className="
                        font-['Source_Sans_3',_sans-serif] text-amber-500/80
                        text-[11px] tracking-wider uppercase font-light
                      ">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ── Custom Nav Buttons ─────────────────────────────────── */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button className="
              ll-swiper-prev
              w-11 h-11 flex items-center justify-center cursor-pointer!
              border border-amber-400/40 text-amber-400!
              hover:bg-amber-500 hover:text-[#0D1F3C]! hover:border-amber-500!
              transition-all duration-250 rounded-sm
            ">
              <ChevronLeft size={20} strokeWidth={1.8} />
            </button>

            {/* Decorative dot row */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-amber-400/30 rotate-45"
                />
              ))}
            </div>

            <button className="
              ll-swiper-next
              w-11 h-11! flex items-center justify-center
              border border-amber-400/40! cursor-pointer text-amber-400!
              hover:bg-amber-500 hover:text-[#0D1F3C]! hover:border-amber-500!
              transition-all duration-250 rounded-sm
            ">
              <ChevronRight size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ── Bottom institution line ──────────────────────────────── */}
        <p className="
          text-center mt-12!
          font-['Source_Sans_3',_sans-serif] text-[11px]
          tracking-[0.2em] uppercase! text-white/20! font-light!
        ">
          LeafLine · Empowering Academic Excellence
        </p>

      </div>
    </section>
  );
};

export default TestimonialCarousel;