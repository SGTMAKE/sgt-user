import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { calculateShippingClient } from "@/lib/api/shipping/calculate-shipping"

export function useCalculateShipping() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: calculateShippingClient,
    onSuccess: (data, variables) => {
      // Cache the result for this specific country and order total
      queryClient.setQueryData(["shipping", "calculate", variables.country, variables.orderTotal], data)
    },
  })
}

export function useGetShippingCalculation(country: string, orderTotal: number, enabled = true) {
  return useQuery({
    queryKey: ["shipping", "calculate", country, orderTotal],
    queryFn: () => calculateShippingClient({ country, orderTotal }),
    enabled: enabled && !!country && orderTotal > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
