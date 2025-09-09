import React from "react";

const MapSection: React.FC = () => {
  return (
    <section className="w-full mt-28 px-6">
      {/* Heading + Description */}
      <div className="text-center mb-8 font-sans">
        <p className="text-3xl font-bold text-gray-900 ">
          Connect With <span className="text-sky-600">LeafLine</span>
        </p>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
          LeafLine is committed to making learning accessible anytime, anywhere.  
          Use the map below to explore our global presence and see how we’re 
          helping students and educators stay connected worldwide.
        </p>
      </div>

      {/* Map */}
      <div className="w-full h-[400px] rounded-2xl overflow-hidden flex items-center justify-center">
        <iframe
          title="LeafLine Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127083.63586481645!2d6.991149882269485!3d5.51292523363027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104259980202a4a1%3A0x2b97fd8924660eb1!2sOwerri%2C%20Imo!5e0!3m2!1sen!2sng!4v1757192030622!5m2!1sen!2sng"
          width="80%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="border-0 drop-shadow-lg rounded-3xl"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection;
