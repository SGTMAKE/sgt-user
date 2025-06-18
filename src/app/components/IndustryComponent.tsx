"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function IndustryComponent() {
    const data = [
        { tag: "EV Parts", img: "/home/EVParts.png",link:"/store/c/ev-parts"  },
        { tag: "Connection & Wires", img: "/home/connectorWires.png",link:"/connectors-wires"  },
        { tag: "Fasteners", img: "/home/fasteners.png",link:"/fasteners" },
        { tag: "Tools", img: "/tools.png",link:"store/c/tools-and-equipments" },
    ];

    const [index, setIndex] = useState(0);
    const nextSlide = () => setIndex((prev) => (prev + 1) % data.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + data.length) % data.length);

    return (
        <div className="p-7 bg-white mt-10 mb-7">
            <div className="flex justify-between items-center mb-4">
                <div className="">
                    <h2 className="text-2xl md:text-4xl font-semibold mb-7">Shop EV-Components,Tools and more</h2>
                </div>
                <div className="flex space-x-2">
                    <button onClick={prevSlide} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                        <ChevronLeft size={30} />
                    </button>
                    <button onClick={nextSlide} className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600">
                        <ChevronRight size={30} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 m-3 mt-7">
                {data.map((item, i) => (
                    <Link href={item.link} key={i}>
                    <Card key={i} tag={item.tag} img={item.img} active={i === index} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

const Card = ({ tag, img, active }:{ tag:string, img:string, active:boolean }) => {
    return (
        <div className={`relative rounded-xl overflow-hidden shadow-lg transition-transform ${active ? 'scale-105' : 'scale-100'}`}>
            <Image height={500} width={500} src={img} alt={tag} className="w-full h-80 object-cover"/>
            <div className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                {tag}
            </div>
        </div>
    );
};
