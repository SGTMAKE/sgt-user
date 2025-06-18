"use client";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const sections = [
    { name: "Home", link: "home" },
    { name: "Services", link: "services" },
    { name: "Choose Us", link: "choose" },
    { name: "About Us", link: "serve" },
  ];

  const [activeSection, setActiveSection] = useState("home");

  return (
    <footer className="bg-[#18191A] text-white p-8 mt-8 ">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl">
        {/* Logo and Socials */}
        <div className=" flex items-center md:items-start flex-col">
          <Image height={150} width={500} src="/footer-logo.png" alt="Logo" className="w-32 mb-4" />
          <div className="flex space-x-3 mt-4 text-xl">
            <Link href="https://www.facebook.com/share/1XKtj5HDHx/"><FaFacebook size={30} /></Link>
            <Link href="https://www.instagram.com/sgt.make?igsh=MTNhZXJnZm5iMDZzdA=="><FaInstagram size={30} /></Link>
            <Link href="https://www.linkedin.com/company/sgtmake/"><FaLinkedin size={30} /></Link>
          </div>
        </div>

        {/* Services with links */}
        <div>
          <h3 className="font-semibold mb-3">Services</h3>
          <ul className="text-sm space-y-2">
            <li><Link href="/contact">3D Designing</Link></li>
            <li><Link href={{pathname:"/service",query:{"service":"3d-printing"}}}>3D Printing</Link></li>
            <li><Link href={{pathname:"/service",query:{"service":"cnc-machining"}}} >CNC Machining</Link></li>
            <li><Link href="/service/batterypack">Battery Packs</Link></li>
            <li><Link href={{pathname:"/service",query:{"service":"laser-cutting"}}}>Laser Cutting</Link></li>
            <li><Link href="/service/wiring-harness">Wiring Harnesses</Link></li>
          </ul>
        </div>

        {/* Quick Links (Scroll) */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2">
          <li><Link href="/">Home</Link></li>
            <li><Link href="/service">Services</Link></li>
            <li><ScrollLink to="choose" spy={true} smooth={true} offset={-100} duration={500} className={`cursor-pointer`} onSetActive={() => setActiveSection("choose")} >Choose Us</ScrollLink></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        {/* More with links */}
        <div>
          <h3 className="font-semibold mb-3">More</h3>
          <ul className="text-sm space-y-2">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            {/* <li><Link href="/location">Location</Link></li> */}
            <li><Link href="/orders">Track Orders</Link></li>
            <li><Link href="/contact">Help Center</Link></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className=" text-left">
          <h3 className="font-semibold mb-3">Subscribe</h3>
          <input type="email" placeholder="Enter Email" className="w-full p-2 mb-2 rounded bg-transparent border-1 focus:ring-2 ring-orange-500" />
          <button className="bg-orange-500 px-4 py-2 rounded">Submit</button>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-center mt-6 border-t border-gray-700 pt-4 text-sm">
        © {new Date().getFullYear()} All Rights Reserved.
      </div>
      <p className="text-sm text-center">
        Developed & Maintained by <Link href="https://www.arevei.com/" className="font-bold underline cursor-pointer text-[#86EFAC]">www.arevei.com</Link>
      </p>
    </footer>
  );
};

export default Footer;
