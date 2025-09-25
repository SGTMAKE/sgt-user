"use client";
import { useState } from "react";
import {  FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import Image from "next/image";
import { LocateIcon, Mail, Map, Phone } from "lucide-react";

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
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 lg:grid-cols-6 gap-5 lg:gap-3 max-w-6xl">
        {/* Logo and Socials */}
        <div className=" flex items-center md:items-start flex-col text-center md:text-left">
          <Image height={150} width={500} src="/footer-logo.png" alt="Logo" className="w-32 mb-4" />
          <div className="flex space-x-3 mt-4 text-xl">
            <Link href="https://www.facebook.com/share/1XKtj5HDHx/"><FaFacebook size={30} /></Link>
            <Link href="https://www.instagram.com/sgt.make?igsh=MTNhZXJnZm5iMDZzdA=="><FaInstagram size={30} /></Link>
            <Link href="https://www.linkedin.com/company/sgtmake/"><FaLinkedin size={30} /></Link>
          </div>
        </div>

        {/* Services with links */}
        <div className="text-center md:text-left">
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
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2">
          <li><Link href="/">Home</Link></li>
            <li><Link href="/service">Services</Link></li>
            <li><ScrollLink to="choose" spy={true} smooth={true} offset={-100} duration={500} className={`cursor-pointer`} onSetActive={() => setActiveSection("choose")} >Choose Us</ScrollLink></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        {/* More with links */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-3">More</h3>
          <ul className="text-sm space-y-2">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            {/* <li><Link href="/location">Location</Link></li> */}
            <li><Link href="/orders">Track Orders</Link></li>
            <li><Link href="/contact">Help Center</Link></li>
          </ul>
        </div>

        {/* Subscribe */}
        {/* <div className=" text-left">
          <h3 className="font-semibold mb-3">Subscribe</h3>
          <input type="email" placeholder="Enter Email" className="w-full p-2 mb-2 rounded bg-transparent border-1 focus:ring-2 ring-orange-500" />
          <button className="bg-orange-500 px-4 py-2 rounded">Submit</button>
        </div> */}

<div className="   shadow-md rounded-md text-white text-sm col-span-1  sm:col-span-2">
  <h2 className="text-lg font-bold mb-4">Contact Us</h2>
  <p className="mb-6  text-xs">
    If you have any questions or want to <span className="font-semibold">get a free estimate</span> for your services, 
    contact us via email or phone call. We will be very happy to help you!
  </p>

  <div className="flex items-center mb-4 gap-2">
    <Phone className=" text-orange-500 mr-1"/>
    <p className=" flex flex-col gap-0.5 text-center">
    <Link href="tel:9462223735" className=" rounded-md font-medium hover:text-orange-500 hover:underline">+91 9462223735</Link> 
    <span className=" text-center"> or </span>
    <Link href="tel:7014043771" className="  rounded-md font-medium hover:text-orange-500 hover:underline">+91 7014043771</Link>
    </p>

  </div>

  <div className="flex items-center mb-4 gap-2">
  <Mail className=" text-orange-500 mr-1"/>
    <Link href="https://mail.google.com/mail/u/0/?to=support@sgtmake.com&su=SGTMAKE+Help+and+Support&fs=1&tf=cm" className="">support@sgtmake.com</Link>
  </div>

  <div className="flex items-center mb-4 gap-2">
    <span className="w-5 mr-2">
  <LocateIcon className=" text-orange-500 w-5"/>
  </span>
    <p  className=" ">
     6980/2, RIICO Fourth Phase, Industrial Area, Bhilwara 311001, Rajasthan, India
    </p>
  </div>

  <div className="flex items-center gap-2">
    <svg className="w-6 h-6 text-orange-600 " fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h20V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm16 8H2v9a2 2 0 002 2h16a2 2 0 002-2v-9z" />
    </svg>
    <span className=" ">
      Monday – Friday: 9:00 am – 5:00 pm
    </span>
  </div>
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
