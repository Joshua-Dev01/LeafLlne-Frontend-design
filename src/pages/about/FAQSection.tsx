import { Collapse } from "antd";
import type { CollapseProps } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// FAQ Items
const faqItems: CollapseProps["items"] = [
  {
    key: "1",
    label: <span className="font-semibold text-lg">What is LeafLine Study Hub?</span>,
    children: (
      <p className="text-gray-600">
        LeafLine is your digital study companion, offering books, AI-powered tests, and collaboration tools to help you succeed academically.
      </p>
    ),
  },
  {
    key: "2",
    label: <span className="font-semibold text-lg">How do I get started?</span>,
    children: (
      <p className="text-gray-600">
        Sign up for free, choose your subjects, and start exploring personalized study resources immediately.
      </p>
    ),
  },
  {
    key: "3",
    label: <span className="font-semibold text-lg">Is it free to use?</span>,
    children: (
      <p className="text-gray-600">
        Yes! LeafLine offers free access to essential features. Premium options unlock deeper analytics and unlimited resources.
      </p>
    ),
  },
  {
    key: "4",
    label: <span className="font-semibold text-lg">Can I track my progress?</span>,
    children: (
      <p className="text-gray-600">
        Absolutely! Our smart dashboard monitors your study time, completed tasks, and improvements over time.
      </p>
    ),
  },
  {
    key: "5",
    label: <span className="font-semibold text-lg">Can I collaborate with friends?</span>,
    children: (
      <p className="text-gray-600">
        Yes! Join study groups, share notes, and discuss topics with peers to make learning more engaging and fun.
      </p>
    ),
  },
];

export default function FAQSection() {
  const [activeKey, setActiveKey] = useState<string | string[]>("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-12 font-sans overflow-hidden bg-gray-50">
      {/* Floating blurred circles */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-slow"></div>

      {/* Organic blob shapes */}
      <div className="absolute -left-20 top-1/3 w-72 h-72 bg-red-200 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-40 animate-blob"></div>
      <div className="absolute -right-24 bottom-20 w-80 h-80 bg-yellow-200 rounded-[40%_60%_70%_30%/40%_70%_30%_60%] opacity-40 animate-blob-slow"></div>

      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-12 relative z-10">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600">
          Have a question? Find our most commonly asked questions below.
        </p>
      </div>

      {/* FAQ List */}
      <div className="relative z-10 space-y-4">
        {(faqItems ?? [] ).map((item, index) => (
          <div
            key={item?.key}
            data-aos={
              index === 0
                ? "fade-up"
                : index === 1
                ? "fade-right"
                : index === 2
                ? "fade-left"
                : index === 3
                ? "zoom-in"
                : "flip-up"
            }
          >
            <Collapse
              activeKey={activeKey}
              onChange={(key) => setActiveKey(key)}
              items={[
                {
                  key: item.key,
                  label: item.label,
                  children: item.children,
                },
              ]}
              expandIconPosition="end" // ⬅️ Moves plus/minus to the far right
              expandIcon={({ isActive }) =>
                isActive ? (
                  <MinusOutlined className="text-blue-500 text-lg" />
                ) : (
                  <PlusOutlined className="text-blue-500 text-lg" />
                )
              }
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* Tailwind Animations */
<style>
{`
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
@keyframes floatSlow {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
  100% { transform: translateY(0px); }
}
@keyframes blob {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: floatSlow 10s ease-in-out infinite; }
.animate-blob { animation: blob 8s ease-in-out infinite; }
.animate-blob-slow { animation: blob 12s ease-in-out infinite; }
`}
</style>
