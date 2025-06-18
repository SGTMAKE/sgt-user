"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { brassInsertConfig } from "@/lib/fastener-configs"

export default function BrassInsertsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  return <FastenerSelector config={brassInsertConfig} activeCategory={activeCategory} />
} 
