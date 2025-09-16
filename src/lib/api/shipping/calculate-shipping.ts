import axios from "@/config/axios.config"
import { headers } from "next/headers"

export interface ShippingCalculationRequest {
  country: string
  orderTotal: number
}

export interface ShippingCalculationResponse {
  success: boolean
  shippingCost: number
  isFreeShipping: boolean
  freeShippingThreshold: number | null
  countryName?: string
}

export async function calculateShippingServer(data: ShippingCalculationRequest) {
  const headerSequence = headers()
  const cookie = headerSequence.get("cookie")

  const response = await axios.post("/api/shipping/calculate", data, {
    headers: {
      Cookie: `${cookie}`,
    },
  })

  return response.data as ShippingCalculationResponse
}

export async function calculateShippingClient(data: ShippingCalculationRequest) {
  const response = await axios.post("/api/shipping/calculate", data)
  return response.data as ShippingCalculationResponse
}
