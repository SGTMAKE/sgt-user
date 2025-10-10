"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { toast } from "sonner"

interface ShippingRate {
  id: string
  countryCode: string
  countryName: string
  shippingCost: number
  freeShippingThreshold: number | null
}

interface ShippingCalculation {
  shippingCost: number
  isFreeShipping: boolean
  freeShippingThreshold: number | null
  countryName: string
}

interface ShippingContextType {
  availableCountries: ShippingRate[]
  currentShipping: ShippingCalculation | null
  isLoading: boolean
  calculateShipping: (countryCode: string, orderTotal: number) => Promise<void>
  refreshCountries: () => Promise<void>
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined)

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [availableCountries, setAvailableCountries] = useState<ShippingRate[]>([])
  const [currentShipping, setCurrentShipping] = useState<ShippingCalculation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  

  const fetchAvailableCountries = useCallback(async () => {
    try {
      const response = await fetch("/api/shipping/countries")
      const data = await response.json()

      if (data.success) {
        setAvailableCountries(data.countries)
      }
    } catch (error) {
      console.error("Error fetching available countries:", error)
    }
  },[])

  const calculateShipping = useCallback(async (countryCode: string, orderTotal: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode,
          orderTotal,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const calculation: ShippingCalculation = {
          shippingCost: data.shippingCost,
          isFreeShipping: data.isFreeShipping,
          freeShippingThreshold: data.freeShippingThreshold,
          countryName: data.countryName,
        }
        setCurrentShipping(calculation)
      } else {
        toast.error("Failed to calculate shipping")
        setCurrentShipping(null)
      }
    } catch (error) {
      console.error("Error calculating shipping:", error)
      toast.error("Error calculating shipping")
      setCurrentShipping(null)
    } finally {
      setIsLoading(false)
    }
  },[])

  

  const refreshCountries = useCallback(async () => {
    await fetchAvailableCountries()
  },[])

  return (
    <ShippingContext.Provider
      value={{
        availableCountries,
        currentShipping,
        isLoading,
        calculateShipping,
        refreshCountries,
      }}
    >
      {children}
    </ShippingContext.Provider>
  )
}

export function useShipping() {
  const context = useContext(ShippingContext)
  if (context === undefined) {
    throw new Error("useShipping must be used within a ShippingProvider")
  }
  return context
}
