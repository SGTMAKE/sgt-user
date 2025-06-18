import Image from "next/image";
import Footer from "../components/Footer";
import CustomerReview from "../components/Review";
import ReviewCarousel from "./review-carausel";
import { ServeCard, ServeCard2 } from "../components/ServeCards"; // Updated import

export default function AboutPage() {
    return (
        <>
            <div className="container px-4 py-12">

                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Empowering Innovation <br /> Through Precision Manufacturing
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                SGTMake is your trusted partner for high-quality industrial components,
                                equipment, and manufacturing services.
                            </p>
                        </div>

                <div className="mt-10 rounded-xl overflow-hidden shadow-lg">
                    <Image src="/about1.png" width={1920} height={900} alt="About Us" className="w-full object-cover" />
                </div>

                <div className="mt-16">
                    <ServeCard
                        img="/about/future.jpg"
                        head="Our Story: Building the Future"
                        desc1="SGTMake is a dynamic and experienced company dedicated to transforming innovative ideas into tangible realities. With over 8 years of expertise, we serve a diverse range of clients, from individual inventors and small businesses to large corporations and original equipment manufacturers (OEMs).

"                        desc2="Our focus is on fostering collaborative partnerships and providing the technical expertise needed to bring complex projects to fruition. We pride ourselves on a culture of precision, quality, and responsiveness, ensuring that every undertaking receives the dedicated attention it deserves."
                    />
                    <ServeCard2
                        img="/about/Mechanical.jpg"
                        head="What’s Our Strength"
                        desc1="Our strength lies in our ability to translate abstract concepts into precise designs and functional prototypes, paving the way for efficient and cost-effective manufacturing. We believe in open communication and close collaboration with our clients, ensuring that their vision remains at the core of every project. Our team is comprised of skilled professionals passionate about problem-solving and delivering exceptional results."
                        desc2="We believe in building long-term relationships based on trust, transparency, and a shared commitment to excellence. We strive to empower our clients by providing the expertise and resources they need to succeed in today's competitive market."
                    />
                </div>
                <ReviewCarousel/>
            </div>
            <Footer />
        </>
    );
}