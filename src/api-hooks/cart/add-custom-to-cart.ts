import axios from "@/config/axios.config"
import type { CartItemRes } from "@/lib/types/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type UseAddCustomToCartProps = {
  onMutate?: () => void
  onSuccess?: () => void
}

// This function handles adding a Custom (custom product) to the cart
async function handleCustomCart(values: {
  quantity: number
  color: string | null
  customProduct: any
}) {
  const { data } = await axios.post("/api/cart", values)
  return data as CartItemRes
}

export function useAddCustomToCart({ onMutate, onSuccess }: UseAddCustomToCartProps = {}) {
  return useMutation({
    mutationFn: handleCustomCart,
    onMutate,
    onSuccess,
    onError: ({ response }) => {
      toast.error(response?.data.message)
    },
  })
}
