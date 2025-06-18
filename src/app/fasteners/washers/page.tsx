"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { washerConfig } from "@/lib/fastener-configs"

export default function WashersPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={washerConfig} activeCategory={activeCategory} />
}
