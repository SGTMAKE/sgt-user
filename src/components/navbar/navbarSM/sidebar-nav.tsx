"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import DropdownItem from "./dropdown-item";
import ClientLink from "@/components/shared/client-link";
import { navItems } from "../navlist";
// export type NavItem = {
//   label: string;
//   link?: string;
//   children?: NavItem[];
// };

// export const navItems: NavItem[] = [
//   {
//     label: "Products",
//     link: "#",
//     children: [
//       {
//         label: "Fasteners",
//         link: "/fastner",
//       },
//       {
//         label: "Tools & Equipment",
//         link: "/store/c/ev-parts",
//       },
//       {
//         label: "EV Parts",
//         link: "store/c/tools-&-equipments",
//       },
//       {
//         label: "Connectors & Wires",
//         link: "/connectors-wires",
//       }
//     ]
//   },
//   {
//     label: "Services",
//     link: "#",
//     children: [
//       {
//         label: "CNC Machining",
//         link: "/service?service=cnc-machining"
//       },
//       {
//         label: "Laser Cutting",
//         link: "/service?service=laser-cutting"
//       },
//       {
//         label: "3D Printing",
//         link: "/service?service=designing"
//       },
//       {
//         label: "Wiring Harness",
//         link: "/service/wiring-harness"
//       },
//       {
//         label: "Battery Pack",
//         link: "/service/batterypack"
//       }
//     ]
//   },
//   {
//     label: "Contact Us",
//     link: "/contact"
//   },
//   {
//     label: "Support",
//     link: "/support"
//   }
// ];
const SidebarNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader className="mb-5 text-left">
          <SheetTitle>SGT Make</SheetTitle>
        </SheetHeader>
        <ul className="text-left">
          {navItems?.map((item, i) => <DropdownItem item={item} key={i} />)}
          <div className="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-200">
        
          </div>
        </ul>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarNav;
