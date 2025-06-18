import { ServicesData } from "./data"
import ServiceCard from "./ServiceCard"

export default function Services() {
   
    return (
        <>
            <div className="my-8" id="services">
                <h1 className="text-center text-4xl font-bold mb-10">Discover Our Services</h1>

                <div className=" mt-3 sm:mx-10 lg:mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-w-6xl  ">
                    {ServicesData.map((item, index) => (
                        <ServiceCard
                            key={index}
                            imgSrc={item.imgSrc}
                            title={item.title}
                            description={item.description}
                            golink = {item.link}
                        />
                    ))}
                </div>

            </div>

        </>
    )
}