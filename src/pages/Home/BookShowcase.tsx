import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const books = [
  {
    title: "Atomic Habits",
    description: "A guide to building good habits and breaking bad ones.",
    image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    title: "Deep Work",
    description: "Master the art of focused success in a distracted world.",
    image: "https://m.media-amazon.com/images/I/71RkVtW+dYL.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    description: "Learn the financial mindset for lasting wealth.",
    image: "https://m.media-amazon.com/images/I/81BE7eeKzAL.jpg",
  },
  {
    title: "The Alchemist",
    description: "A philosophical story about destiny and dreams.",
    image: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg",
  },
  {
    title: "Start With Why",
    description: "Understand why some leaders inspire better than others.",
    image: "https://m.media-amazon.com/images/I/81pyObSx-rL.jpg",
  },
  {
    title: "Can't Hurt Me",
    description: "Push past your limits and uncover your true potential.",
    image: "https://m.media-amazon.com/images/I/81oH9wN9S0L.jpg",
  },
];

const BookShowcase = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <section className="md:px-20 px-6 py-16 bg-white">
      <h2
        className="text-3xl font-bold text-center mb-12 text-[#0d0c22]"
        data-aos="fade-up"
      >
        Top Picks Just for You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-32">
        {books.map((book, i) => (
          <div
            key={i}
            className="flip-card w-full h-80 shadow-lg"
            data-aos={i % 2 === 0 ? "fade-left" : "fade-right"}
            data-aos-delay={i * 100}
          >
            <div className="flip-inner w-full h-full relative rounded-xl bg-white ">
              {/* Front */}
              <div className="flip-front ">
                <div className=" h-full flex items-center justify-center bg-gray-100 py-5 rounded-md overflow-hidden mb-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full object-contain"
                  />
                </div>
                <h3 className="text-md font-semibold mb-1 text-[#0d0c22]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.description}</p>
              </div>

              {/* Back */}
              <div className="flip-back bg-[#0d0c22] !text-white p-4 rounded-xl flex items-center justify-center">
                <Link to="/dashboard">
                  <button className="bg-white !text-[#0d0c22] px-6 py-2 rounded-full font-semibold text-sm shadow hover:scale-105 transition">
                    View Book
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookShowcase;
