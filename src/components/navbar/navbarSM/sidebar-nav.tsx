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
import { navItems } from "../navlist";
import { CurrencySelector } from "@/components/currency/currency-selector";

const SidebarNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader className="mb-5 text-left">
          <SheetTitle>SGT Make</SheetTitle>
          <CurrencySelector  />
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
