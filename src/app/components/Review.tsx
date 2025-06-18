"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    quote:
      "I was blown away by the sheer variety of products available on this platform. From electronics to home goods to unique fashion finds, I found everything I was looking for and more. The selection is truly impressive!",
    name: "John Doe",
    position: "Manager, Megatix Steels",
    img: "/testimonial1.png",
  },
  {
    quote: "Exceptional service and quality. Every product exceeded my expectations!I was blown away by the sheer variety of products available on this platform. From electronics to home goods to unique fashion finds.",
    name: "Jane Smith",
    position: "CEO, Acme Corp",
    img: "/testimonial3.png",
  },
  {
    quote: "A seamless experience from start to finish. Highly recommended! A seamless experience from start to finish. Highly recommended! A seamless experience from start to finish. Highly recommended!",
    name: "Alex Johnson",
    position: "CTO, Tech Solutions",
    img: "/testimonial2.png",
  },
];

const CustomerReview = () => {
  const [current, setCurrent] = useState(0);
  const total = reviews.length;

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <section className="p-8 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto">
      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Hear From Our Customer Review</h2>
        <p className="text-gray-600 mb-6">
        Hear from real customers who have experienced our products and services firsthand. Read their honest feedback and earn why they choose us.
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <button
            onClick={handlePrev}
            className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
            aria-label="Previous Review"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-orange-400 hover:bg-orange-600 text-white rounded-full transition"
            aria-label="Next Review"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-2/3 bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto overflow-hidden">
        <div
          key={current}
          className="fade-in-slide"
        >
          <p className="text-xl font-medium text-gray-800 italic mb-6">“{reviews[current].quote}”</p>
          <div className="flex items-center gap-4">
            <Image
              src={reviews[current].img}
              alt={reviews[current].name}
              height={50}
              width={50}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{reviews[current].name}</p>
              <p className="text-gray-500 text-sm">{reviews[current].position}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for Animation */}
      <style jsx>{`
        .fade-in-slide {
          animation: fadeSlide 0.5s ease-in-out;
        }

        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CustomerReview;
