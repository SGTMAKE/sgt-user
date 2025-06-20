"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    quote:
      "I was amazed by the vast range of products on this platform. From cutting-edge electronics to elegant home goods and fashion items, everything exceeded my expectations.",
    name: "Mr. Raghav Malhotra",
    position: "Operations Head, Sterling Group",
    img: "/testimonial1.png",
    rating: 5,
  },
  {
    quote:
      "Outstanding service and premium product quality. The team is incredibly professional, and my entire experience was seamless from start to finish.",
    name: "Ms. Priya Sharma",
    position: "CEO, Horizon Tech Pvt Ltd",
    img: "/testimonial3.png",
    rating: 4,
  },
  {
    quote:
      "Highly reliable platform with top-notch customer service. I was impressed by the attention to detail and quick delivery.",
    name: "Ms. Shubhani Verma",
    position: "Executive Administrative Assistant",
    img: "/testimonial2.png",
    rating: 5,
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
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Hear From Our Customers
        </h2>
        <p className="text-gray-600 mb-6">
          Discover real experiences from satisfied customers who trust our
          products and services. See why businesses choose to work with us.
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
        <div key={current} className="fade-in-slide">
          <p className="text-xl font-medium text-gray-800 italic mb-6">
            “{reviews[current].quote}”
          </p>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={reviews[current].img}
              alt={reviews[current].name}
              height={50}
              width={50}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {reviews[current].name}
              </p>
              <p className="text-gray-500 text-sm">{reviews[current].position}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={20}
                className={`${
                  index < reviews[current].rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
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
