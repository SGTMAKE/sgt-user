import { useQuery } from "@tanstack/react-query"
import { getShippingCountries } from "@/lib/api/shipping/get-shipping-countries"

export function useGetShippingCountries() {
  return useQuery({
    queryKey: ["shipping", "countries"],
    queryFn: getShippingCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
