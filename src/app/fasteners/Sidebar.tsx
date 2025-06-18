"use client";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  "Bolts",
  "Nuts",
  "Sand Offs",
  "Washers",
  "Brass Inserts",
  "Rev Nuts",
  "Screw"
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-60 p-3 h-96 bg-[#F6F5F5] rounded-xl shadow-md flex flex-col gap-2 border border-[#807B7B3D]">
    <ul className="space-y-2">
      {menuItems.map((item) => {
        const path = `/fastner/${item.toLowerCase().replace(/ /g, "-")}`;
        return (
          <li
            key={item}
            className={`p-3 text-sm font-medium cursor-pointer rounded-md transition-all text-center 
              ${pathname === path ? "bg-orange-100 text-orange-600 font-bold" : "hover:bg-gray-200"}`}
            onClick={() => router.push(path)}
          >
            {item}
          </li>
        );
      })}
    </ul>
  </aside>
  );
}