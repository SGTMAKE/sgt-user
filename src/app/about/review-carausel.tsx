
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Image from "next/image";
interface Review {
  id: number;
  rating: number;
  text: string;
  customerName: string;
  company: string;
  image: string;
}
const reviews: Review[] = [
  {
    id: 1,
    rating: 5,
    text: "The service exceeded all our expectations. The team's attention to detail and commitment to excellence made our project a huge success.",
    customerName: "Sarah Johnson",
    company: "Tech Innovators",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 2,
    rating: 5,
    text: "Working with this team has transformed our business. Their innovative solutions and reliable support have been invaluable to our growth.",
    customerName: "Michael Chen",
    company: "Digital Solutions Co",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 3,
    rating: 5,
    text: "Outstanding experience from start to finish. The results have far exceeded our expectations and continue to drive our success.",
    customerName: "Emily Rodriguez",
    company: "Creative Studios",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 4,
    rating: 5,
    text: "Their expertise and professionalism are unmatched. We've seen remarkable improvements in our operations since implementing their solutions.",
    customerName: "David Kim",
    company: "Global Enterprises",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces"
  }
];

const TestimonialCarousel = () => {
  return (
    <div className="w-full mx-auto py-10">
      <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">What Our Customers Say</h2>
      
      <Swiper
        modules={[Navigation, Pagination,Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10"
      >
        {reviews.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white   shadow-[0px_32px_64px_-16px_rgba(57,59,106,0.06)] p-6 text-center border-1 border-[rgba(207,207,207,1)] rounded-xl space-y-5 py-8 my-10
">
              <div className="flex justify-center mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-black-500 text-2xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">{testimonial.text}</p>
              <div className="flex items-center justify-center gap-3">
                <Image src={testimonial.image} alt={testimonial.customerName} width={40} height={40} className="rounded-full" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{testimonial.customerName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialCarousel;
