import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fasteners | Custom Manufacturing",
  description: "Browse our selection of high-quality fasteners for your projects",
}

interface FastenerLayoutProps {
  children: ReactNode
}



export default function FastenerLayout({ children }: FastenerLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
    </div>
  )
}
