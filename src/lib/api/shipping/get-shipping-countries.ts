import axios from "@/config/axios.config"

export interface ShippingCountry {
  code: string
  name: string
  flag: string
  shippingCost: number
  freeShippingThreshold: number | null
}

export interface ShippingCountriesResponse {
  success: boolean
  countries: ShippingCountry[]
}

export async function getShippingCountries() {
  const { data } = await axios.get("/api/shipping/countries")
  return data as ShippingCountriesResponse
}
