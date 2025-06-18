import ClientLink from "@/components/shared/client-link";
import { ChevronDown } from "lucide-react";

import { useRouter } from "next/navigation";
import { NavItem } from "../navlist";
const DropdownItem = ({ item }: { item: NavItem }) => {
  const router = useRouter();
  return (
    <li>
      <input type="checkbox" id={`menu-${item.label}`} className="toggle" />
      <label
        className="item flex cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-2 text-sm duration-400 hover:bg-gray-200 active:scale-95"
        { ...item.children ? {}: { onClick: () =>router.push(`${item.link}`)} }
        htmlFor={`menu-${item.label}`}
        
      >
        <span className="text-base font-medium">{item.label}</span>
        
        { item.children ? <span className="icon duration-300 active:rotate-90">
          <ChevronDown size={15} />
        </span>:""}
      </label>

      <div className="menu-collapse grid grid-rows-[0fr] overflow-hidden transition-[padding_grid-template-rows]">
        <div className="min-h-0">
          <ul>
            {item.children &&
              item.children.map((child:NavItem, i) => (
                <li key={i}>
                  <label className="ml-3 flex flex-col gap-2 rounded-lg px-4 py-2 duration-400 hover:bg-gray-200 active:scale-95">
                    <ClientLink
                      htmlFor="drawer-left"
                      redirect={`${child.link}`}
                      className="cursor-pointer p-0 text-sm"
                    >
                      {child.label}
                    </ClientLink>
                  </label>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default DropdownItem;
