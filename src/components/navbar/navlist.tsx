/** @format */
"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { IoIosArrowUp } from "react-icons/io";

import { AiOutlineClose } from "react-icons/ai";
// import { useAutoAnimate } from "@formkit/auto-animate/react";

export type NavItem = {
  label: string;
  link?: string | object;
  children?: NavItem[];
  iconImage?: string;
};

export const navItems: NavItem[] = [
  {
    label: "Products",
    link: "#",
    children: [
      {
        label: "Fasteners",
        link: "/fasteners",
      },
      {
        label: "Tools & Equipment",
        link: "/store/c/tools-and-equipments",
      },
      {
        label: "EV Parts",
        link: "/store/c/ev-parts",
      },
      {
        label: "Connectors & Wires",
        link: "/connectors-wires",
      }
    ]
  },
  {
    label: "Services",
    link: "#",
    children: [
      {
        label: "CNC Machining",
        link: "/service?service=cnc-machining"
      },
      {
        label: "Laser Cutting",
        link: "/service?service=laser-cutting"
      },
      {
        label: "3D Printing",
        link: "/service?service=3d-printing"
      },
      {
        label: "Wiring Harness",
        link: "/service/wiring-harness"
      },
      {
        label: "Battery Pack",
        link: "/service/batterypack"
      }
    ]
  },
  {
    label: "About Us",
    link: "/about"
  },
  {
    label: "Contact Us",
    link: "/contact"
  },
  {
    label: "Support",
    link: "/support",
  }
];

export default function Navlist() {
//   const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenue] = useState(false);
  function openSideMenu() {
    setSideMenue(true);
  }
  function closeSideMenu() {
    setSideMenue(false);
  }

  return (
    <div >
      {/* left side  */}
      <section className="flex items-center gap-10">
    
        {isSideMenuOpen && <MobileNav closeSideMenu={closeSideMenu} />}
        <div className="hidden md:flex items-center gap-4 transition-all">
          {navItems.map((d, i) => (
            <Link
              key={i}
              href={d.link ?? "#"}
              className="relative group  px-2 py-3 transition-all "
            >
              <span className="flex cursor-pointer items-center gap-2 text-gray-700 group-hover:text-black ">
                <span>{d.label}</span>
                {d.children && (
                  <IoIosArrowUp className=" rotate-180  transition-all group-hover:rotate-0" />
                )}
              </span>

              {/* dropdown */}
              {d.children && (
                <p className="absolute   left-0   top-10 hidden w-auto  flex-col gap-1   rounded-lg bg-white py-3 shadow-md  transition-all group-hover:flex ">
                  {d.children.map((ch, i) => (
                    <Link
                      key={i}
                      href={ch.link ?? "#"}
                      className=" flex cursor-pointer items-center  py-1 pl-6 pr-8  text-neutral-400 hover:text-black  "
                    >
                      {/* image */}
                      {ch.iconImage && (
                        <Image src={ch.iconImage} alt="item-icon" />
                      )}
                      {/* item */}
                      
                      <span className="whitespace-nowrap  p-2 hover:bg-gray-50 rounded-md w-full hover:text-orange-300 ">
                        {ch.label}
                      </span>
                    </Link>
                  ))}
                </p>
              )}
            </Link>
          ))}
        </div>
        {/* navitems */}
      </section>

   

      {/* <FiMenu
        onClick={openSideMenu}
        className="cursor-pointer text-4xl md:hidden"
      /> */}
    </div>
  );
}

function MobileNav({ closeSideMenu }: { closeSideMenu: () => void }) {
  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
      <div className=" h-full w-[65%] bg-white px-4 py-4">
        <section className="flex justify-end">
          <AiOutlineClose
            onClick={closeSideMenu}
            className="cursor-pointer text-4xl "
          />
        </section>
        <div className=" flex flex-col text-base  gap-2 transition-all">
          {navItems.map((d, i) => (
            <SingleNavItem
              key={i}
              label={d.label}
              iconImage={d.iconImage}
              link={d.link}
            >
              {d.children}
            </SingleNavItem>
          ))}
        </div>

        <section className="  flex  flex-col   gap-8  mt-4 items-center">
          <button className="h-fit text-neutral-400 transition-all hover:text-black/90">
            Login
          </button>

          <button className="w-full  max-w-[200px]  rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90">
            Register
          </button>
        </section>
      </div>
    </div>
  );
}

function SingleNavItem(d: NavItem) {
//   const [animationParent] = useAutoAnimate();
  const [isItemOpen, setItem] = useState(false);

  function toggleItem() {
    return setItem(!isItemOpen);
  }

  return (
    <Link
      onClick={toggleItem}
      href={d.link ?? "#"}
      className="relative   px-2 py-3 transition-all "
    >
      <p className="flex cursor-pointer items-center gap-2 text-neutral-400 group-hover:text-black ">
        <span>{d.label}</span>
        {d.children && (
          // rotate-180
          <IoIosArrowUp
            className={`text-xs transition-all  ${isItemOpen && " rotate-180"}`}
          />
        )}
      </p>

      {/* dropdown */}
      {isItemOpen && d.children && (
        <div className="  w-auto  flex-col gap-1   rounded-lg bg-white py-3   transition-all flex ">
          {d.children.map((ch, i) => (
            <Link
              key={i}
              href={ch.link ?? "#"}
              className=" flex cursor-pointer items-center  py-1 pl-6 pr-8  text-neutral-400 hover:text-black  "
            >
              {/* image */}
              {ch.iconImage && <Image src={ch.iconImage} alt="item-icon" />}
              {/* item */}
              <span className="whitespace-nowrap   pl-3 ">{ch.label}</span>
            </Link>
          ))}
        </div>
      )}
    </Link>
  );
}