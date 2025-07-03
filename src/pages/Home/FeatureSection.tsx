// src/pages/Home/FeatureSection.tsx
const FeatureSection = () => {
  const features = [
    {
      title: "📖 Read Instantly",
      desc: "Access thousands of books anywhere, anytime on any device.",
    },
    {
      title: "⬇️ Download Books",
      desc: "Save books offline and enjoy seamless reading without interruptions.",
    },
    {
      title: "📊 Track Your Progress",
      desc: "See how far you've come and stay motivated to read more.",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-20 bg-white text-center">
      <p className="text-3xl font-bold mb-10 text-[#0d0c22] tracking-wide ">Why Choose LeafLine?</p>
      <div className="grid md:grid-cols-3 gap-10">
        {features.map((item, i) => (
          <div
            key={i}
            className="bg-[#0d0b2b] text-white p-6 rounded-lg shadow hover:shadow-lg transition mt-5"
          >
            <p className="text-xl font-semibold mb-2">{item.title}</p>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
