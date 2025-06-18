import type { ReactNode } from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fasteners | Custom Manufacturing",
  description: "Browse our selection of high-quality fasteners for your projects",
}

interface FastenerLayoutProps {
  children: ReactNode
}

const fastenerCategories = [
  { id: "bolts", name: "Bolts", href: "/fasteners/bolts" },
  { id: "nuts", name: "Nuts", href: "/fasteners/nuts" },
  { id: "stand-offs", name: "Stand Offs", href: "/fasteners/stand-offs" },
  { id: "washers", name: "Washers", href: "/fasteners/washers" },
  { id: "brass-inserts", name: "Brass Inserts", href: "/fasteners/brass-inserts" },
  { id: "rev-nuts", name: "Rev Nuts", href: "/fasteners/rev-nuts" },
  { id: "screw", name: "Screw", href: "/fasteners/screw" },
]

export default function FastenerLayout({ children }: FastenerLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Fasteners</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/5">
          <nav className="bg-[#F6F5F5] p-1  border-3 border-[#807B7B3D] rounded-xl h-auto  md:h-full">
            <ul className="space-y-1 sticky top-6">
              {fastenerCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className={`block px-4 py-2 rounded-md hover:bg-orange-100 hover:text-orange-500 transition-colors`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5">{children}</div>
      </div>
    </div>
  )
}
