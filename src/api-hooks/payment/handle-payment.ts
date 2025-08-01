import { useMutation } from "@tanstack/react-query"
import type { PaymentRes } from "@/lib/types/types"
import axios from "@/config/axios.config"

interface PaymentRequest {
  addressId: string
  currency: string
  exchangeRate: number
  totalAmount?: number
}

const handlePayment = async (data: PaymentRequest): Promise<PaymentRes> => {
  const response = await axios.post("/api/payment", data)
  return response.data
}

export const usePayment = (onSuccess: (data: PaymentRes) => void) => {
  return useMutation({
    mutationFn: handlePayment,
    onSuccess,
    onError: (error) => {
      console.error("Payment error:", error)
    },
  })
}
