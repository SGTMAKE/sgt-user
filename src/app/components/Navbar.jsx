"use client";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const sections = [{ name: "Home", link: "home" }, { name: "Services", link: "services" },{ name: "Choose Us", link: "choose" }, { name: "About Us", link: "serve" }];

  return (
    <nav className="flex items-center justify-between p-5 bg-[#ffffff9d] backdrop-blur-md shadow-md top-0 left-0 w-full z-50 sticky">
     
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={74} height={74} />
      </div>

      <ul className="hidden md:flex gap-6 text-gray-900 ">
      {sections.map((section) => (
      <Link
      key={section.link}
      to={section.link}
      spy={true}
      smooth={true}
      offset={-100}
      duration={500}
      className={`cursor-pointer ${
        activeSection === section.link ? "text-orange-500 font-bold" : ""
      }`}
      onSetActive={() => setActiveSection(section.link)}
    >
      {section.name}
    </Link>
      ))}
      </ul>

    
      <div className="hidden md:flex items-center gap-4">
        {/* <Search className="w-5 h-5 cursor-pointer" /> */}
        {/* <ShoppingCart className="w-5 h-5 cursor-pointer" /> */}
        <Link  to="contact"
      spy={true}
      smooth={true}
      offset={-100}
      duration={500}
      onSetActive={() => setActiveSection("contact")}  className="bg-orange-500 text-white px-4 py-2 cursor-pointer rounded-md">
          Contact Us
        </Link>
      </div>

      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

     
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-5 md:hidden">
          <ul className="flex flex-col gap-4 text-gray-700">
          {sections.map((section) => (
        <Link
          key={section.link}
          to={section.link}
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className={`cursor-pointer ${
            activeSection === section.link ? "text-orange-500 font-bold" : ""
          }`}
          onSetActive={() => setActiveSection(section.link)}
        >
          {section.name}
        </Link>
      ))}
           
          </ul>
          {/* <div className="mt-4 flex items-center gap-4">
            <Search className="w-5 h-5 cursor-pointer" />
            <ShoppingCart className="w-5 h-5 cursor-pointer" />
            <Link href="/signin" className="bg-orange-500 text-white px-4 py-2 rounded-md">
              Sign In
            </Link>
          </div> */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
