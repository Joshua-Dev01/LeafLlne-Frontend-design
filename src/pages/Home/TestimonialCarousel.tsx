import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import {  Star } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/100?img=1',
    message:
      'LeafLine completely changed how I read books. It’s my go-to platform!',
    rating: 5,
  },
  {
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/100?img=2',
    message: 'I’ve discovered so many great reads thanks to LeafLine.',
    rating: 4,
  },
  {
    name: 'Michael Brown',
    avatar: 'https://i.pravatar.cc/100?img=3',
    message: 'Simple, elegant and effective. A must-have for book lovers.',
    rating: 5,
  },
  {
    name: 'Sophia Green',
    avatar: 'https://i.pravatar.cc/100?img=4',
    message: 'The best book platform I’ve ever used!',
    rating: 5,
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="py-20 px-2 md:px-20 relative">
      <motion.h2
        className="!text-3xl !font-bold text-center !mb-12 text-[#0d0c22] "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        What our users said 
      </motion.h2>

      {/* Carousel Container */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
          }}
        >
          {testimonials.map((testimonial, i) => (
            <SwiperSlide key={i}>
              <motion.div
                className="bg-[#0d0c22] rounded-xl p-6 shadow hover:shadow-lg h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <h3 className="text-md font-semibold text-white">
                    {testimonial.name}
                  </h3>
                </div>

                <p className="text-sm text-white mb-3">
                  {testimonial.message}
                </p>

                {/* ⭐ Star Rating */}
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      fill={index < testimonial.rating ? '#facc15' : 'none'}
                      stroke={index < testimonial.rating ? '#facc15' : '#d1d5db'}
                    />
                  ))}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons (positioned far ends) */}
        {/* <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-10 swiper-button-prev text-gray-700 cursor-pointer ">
          <ChevronLeft size={30} className="hover:text-black" />
        </div>
        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-10 swiper-button-next text-gray-700 cursor-pointer">
          <ChevronRight size={30} className="hover:text-black md:hidden " />
        </div> */}
      </div>
    </section>
  );
};

export default TestimonialCarousel;
