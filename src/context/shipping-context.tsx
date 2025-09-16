"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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

  

  const fetchAvailableCountries = async () => {
    try {
      const response = await fetch("/api/shipping/countries")
      const data = await response.json()

      if (data.success) {
        setAvailableCountries(data.countries)
      }
    } catch (error) {
      console.error("Error fetching available countries:", error)
    }
  }

  const calculateShipping = async (countryCode: string, orderTotal: number) => {
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
  }

  // const getShippingForCountry = (countryCode: string, orderTotal: number): ShippingCalculation | null => {
  //   const country = availableCountries.find((c) => c.countryCode === countryCode)
  //   if (!country) return null

  //   const isFreeShipping = country.freeShippingThreshold ? orderTotal >= country.freeShippingThreshold : false

  //   return {
  //     shippingCost: isFreeShipping ? 0 : country.shippingCost,
  //     isFreeShipping,
  //     freeShippingThreshold: country.freeShippingThreshold,
  //     countryName: country.countryName,
  //   }
  // }

  const refreshCountries = async () => {
    await fetchAvailableCountries()
  }

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
