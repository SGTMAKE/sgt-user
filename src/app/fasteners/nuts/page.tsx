"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { nutConfig } from "@/lib/fastener-configs"

export default function NutsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={nutConfig} activeCategory={activeCategory} />
}
