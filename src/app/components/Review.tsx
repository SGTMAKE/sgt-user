"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination, Autoplay } from "swiper/modules";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Star, UserCircle2Icon } from "lucide-react";
const reviews = [
  {
    quote:
      "We ordered a precision-machined component from SGTMake, and the results were outstanding — exceptional accuracy, superior finish, and attention to detail. Their professionalism, clear communication, and timely delivery made the process seamless. A truly reliable partner for quality engineering.",
    name: "Shubham Kalra ",
    position: "Antsys innovations Pvt ltd",
    img: "/testimonial1.png",
    rating: 5,
  },
  {
    quote:
      "SGTMake delivered outstanding engineering services with deep technical expertise, timely execution, and practical solutions. Their innovation and attention to detail saved us time and resources, setting a benchmark in reliability and excellence.",
    name: "Saivi Industries",
    position: "",
    img: "/testimonial3.png",
    rating: 4,
  },
  {
    quote:
      "The battery packs from SGTMake are top-notch — reliable, durable, and backed with excellent support. Perfect for our EV conversions!",
    name: "Ravi K., Pune",
    position: "",
    img: "/testimonial2.png",
    rating: 5,
  },
  {
    quote:
      "We ordered connectors and wiring harnesses from SGTMake, and the quality is far better than local alternatives. Timely delivery too.",
    name: "Mehul S., Bangalore",
    position: "",
    img: "/testimonial2.png",
    rating: 5,
  },
  {
    quote:
      "SGTMake EV parts are premium yet competitively priced. Their technical team guided us through installation without any hassle.",
    name: "Priya M., Delhi",
    position: "",
    img: "/testimonial2.png",
    rating: 5,
  },
];

const CustomerReview = () => {
  const swiperRef = useRef<any>(null);

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

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center md:justify-start gap-4">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
            aria-label="Previous Review"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-3 bg-orange-400 hover:bg-orange-600 text-white rounded-full transition"
            aria-label="Next Review"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Right Section with Swiper */}
      <div className="md:w-2/3 bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          // pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full"
          
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="flex justify-center items-center">
              <div >
                <p className="text-base md:text-lg font-medium text-gray-800 italic mb-6">
                  “{review.quote}”
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle2Icon size={40} />
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-gray-500 text-sm">{review.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={`${
                        index < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReview;
