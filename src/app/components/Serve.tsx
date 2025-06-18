import Image from 'next/image';

export default function Serve() {
    const data = [
        {
            img: '/car.png',
            head: 'Automotive',
            desc: 'We provide a range of solutions for the automotive industry, from reliable components and spare parts to advanced materials for light-weighting and safety systems.'
        },
        {
            img: '/fuel.jpg',
            head: 'Electric Vehicles',
            desc: 'We support the growing electric vehicle market with high-performance batteries, power electronics, and light-weighting solutions for a sustainable future.'
        },
        {
            img: '/wind.jpg',
            head: 'Power & Energy Systems',
            desc: 'We deliver innovative solutions for power generation, transmission, and distribution with a focus on sustainable energy technologies and grid modernization components.'
        },
        {
            img: '/lab.jpg',
            head: 'Medical',
            desc: 'We partner with medical device manufacturers to deliver high-precision parts and advanced materials for implants, surgical instruments, and diagnostic equipment.'
        },
        {
            img: '/home/Robotics.png',
            head: 'Robotics',
            desc: ' We design and manufacture precision components and assemblies for robotic systems, ensuring durability, accuracy, and performance in automation, research, and industrial applications.'
        },
        {
            img: '/home/UAV.png',
            head: 'UAV (Unmanned Aerial Vehicles)',
            desc: ' SGTMake supplies lightweight, high-strength parts for UAVs, including structural frames and battery solutions, optimised for flight performance, stability, and endurance.'
        },
        {
            img: '/home/Drones.png',
            head: 'Drones',
            desc: ' We build custom drone components such as mounts, enclosures, and wiring systems, tailored for surveillance, mapping, delivery, and other advanced aerial operations.'
        }
    ];

    return (
        <section className="mt-16" id='serve'>
            <h1 className="text-4xl font-bold text-center ">Industries We Serve</h1>
            <div className="flex flex-wrap justify-around gap-6 max-w-7xl mx-auto">
                {data.map((item, index) => (
                    index % 2 === 0
                        ? <ServeCard key={index} {...item} />
                        : <ServeCard2 key={index} {...item} />
                ))}
            </div>
        </section>
    );
}

const ServeCard = ({ img, head, desc }:any) => {
    return (
        <div className="flex flex-col md:flex-row  justify-center items-center bg-white rounded-2xl shadow p-6 m-5 gap-6 ">
            <div className="md:w-auto w-full rounded-2xl overflow-hidden flex justify-center items-center">
                <Image src={img} alt={head} height={500} width={500} className="object-cover rounded-xl" />
            </div>
            <div className="mt-7 md:mt-0 flex flex-col justify-center md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-600 text-lg">{desc}</p>
            </div>
        </div>
    );
};

const ServeCard2 = ({ img, head, desc }:any  ) => {
    return (
        <div className="flex flex-col-reverse md:flex-row justify-center items-center bg-white rounded-2xl shadow p-6 m-5 gap-6  ">
            <div className="mt-7 md:mt-0 flex flex-col  w-full pl-0 md:pl-10">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-600 text-lg">{desc}</p>
            </div>
            <div className=" w-full rounded-2xl overflow-hidden flex justify-center items-center">
                <Image src={img} alt={head} height={500} width={500} className="object-fit rounded-xl" />
            </div>
        </div>
    );
};  