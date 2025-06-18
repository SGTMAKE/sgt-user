"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { boltConfig } from "@/lib/fastener-configs"

export default function BoltsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={boltConfig} activeCategory={activeCategory} />
}
