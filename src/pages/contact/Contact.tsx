import { Input, Select, Button } from "antd";
import { toast } from "sonner";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import MapSection from "./Map";
import Aos from "aos";

Aos.init();
const { TextArea } = Input;

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("🎉 Form successfully submitted!");
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-violet-50">
      <Navbar />

      {/* Contact Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-12 max-w-6xl w-full">
          {/* LEFT SIDE - LeafLine Info */}
          <div className="flex-1 mt-32 font-sans">
            <p className="uppercase text-sm tracking-widest text-gray-500 font-semibold">
              We’re here to help you
            </p>
            <h2 className="text-4xl font-bold text-gray-900 leading-snug">
              Discuss Your <span className="text-[#0b083a]">LeafLine</span> Study
              Needs
            </h2>
            <p className="text-gray-600 max-w-md leading-relaxed">
              At LeafLine, we make learning smarter, easier, and more
              collaborative. Whether you're a student or educator, we help you
              organize resources, share notes, and achieve your study goals.
            </p>
          </div>

          {/* RIGHT SIDE - KEEPING FORM UNTOUCHED */}
          <div className="flex-1 w-full max-w-lg">
            <div className=" shadow-md rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  placeholder="Name"
                  data-aos="fade-right"
                  className="!h-12 !rounded-lg !border-2 !border-[#0b083a] focus:!border-sky-600 !bg-gray-50 !mb-10"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  data-aos="fade-bottom"
                  className="!h-12 !rounded-lg !border-2 !border-[#0b083a] focus:!border-sky-600 !bg-gray-50 !mb-10"
                  required
                />
                <Select
                  placeholder="Select Industry"
                  className="!w-full !h-12 !rounded-lg !border-2 !border-[#0b083a] focus:!border-sky-600 !bg-gray-50 !mb-10"
                  options={[
                    { value: "tech", label: "Technology" },
                    { value: "edu", label: "Education" },
                    { value: "med", label: "Medical" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <TextArea
                  placeholder="Message"
                  data-aos="fade-up"
                  rows={4}
                  className="!rounded-lg !border-2 !border-[#0b083a] focus:!border-sky-600 !bg-gray-50 !mb-10"
                  required
                />

                <Button
                  htmlType="submit"
                  type="primary"
                  className="!w-full !h-12 !text-lg !font-semibold !flex !items-center !justify-center !gap-2 !rounded-lg !bg-[#0b083a] hover:!bg-sky-700"
                >
                  🚀 Get in Touch
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <MapSection />
      <Footer />
    </div>
  );
};

export default Contact;
