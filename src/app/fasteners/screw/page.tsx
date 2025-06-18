"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { screwConfig } from "@/lib/fastener-configs"

export default function ScrewPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={screwConfig} activeCategory={activeCategory} />
}
