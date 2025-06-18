"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { revNutsConfig } from "@/lib/fastener-configs"

export default function RevNutsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={revNutsConfig} activeCategory={activeCategory} />
}
