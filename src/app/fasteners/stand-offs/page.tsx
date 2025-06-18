"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { sandOffsConfig } from "@/lib/fastener-configs"

export default function SandOffsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={sandOffsConfig} activeCategory={activeCategory} />
}
