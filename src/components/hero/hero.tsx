"use client"

import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import Slider from "./slider"
import type { HeroBanner } from "@prisma/client"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "swiper/css/effect-fade"

const Hero = ({ slides }: { slides?: HeroBanner[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Progress bar animation
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + 100 / 50 // 5 seconds = 50 intervals of 100ms
        })
      }, 100)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex)
    setProgress(0)
  }

  const toggleAutoplay = () => {
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay.stop()
        setIsPlaying(false)
      } else {
        swiperRef.current.autoplay.start()
        setIsPlaying(true)
      }
    }
  }

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
      setProgress(0)
    }
  }

  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  if (!slides || slides.length === 0) {
    return (
      <section className="py-4" id="home">
        <div className="mx-auto h-[26rem] max-w-7xl px-4 md:h-[36rem]">
          <div className="flex h-full items-center justify-center rounded-2xl bg-gray-100">
            <p className="text-gray-500">No banners available</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4" id="home">
      <div className="group relative mx-auto h-[26rem] max-w-7xl px-4 md:h-[36rem]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          speed={800}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={handleSlideChange}
          onAutoplayStart={() => setIsPlaying(true)}
          onAutoplayStop={() => setIsPlaying(false)}
          className="h-full w-full rounded-2xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id || index}>
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <Slider slide={slide} forLargeScreen={true} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 z-30 flex items-center gap-3 pb-8 ps-10 md:left-auto md:right-0 md:pe-20">
          {/* Slide Numbers */}
          <div className="flex items-center gap-2.5">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentIndex === index ? "text-white" : "text-white/60 hover:text-white"
                }`}
                onClick={() => goToSlide(index)}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-16 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={goToPrevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={toggleAutoplay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>

            <button
              onClick={goToNextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:hidden">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                currentIndex === index ? "bg-white" : "bg-white/40"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
