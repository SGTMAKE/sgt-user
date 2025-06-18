import axios from "@/config/axios.config"
import type { CartItemRes } from "@/lib/types/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type UseAddFastenerToCartProps = {
  onMutate?: () => void
  onSuccess?: () => void
}

// This function handles adding a fastener (custom product) to the cart
async function handleFastenerCart(values: {
  quantity: number
  color: string | null
  customProduct: any
}) {
  const { data } = await axios.post("/api/cart", values)
  return data as CartItemRes
}

export function useAddFastenerToCart({ onMutate, onSuccess }: UseAddFastenerToCartProps = {}) {
  return useMutation({
    mutationFn: handleFastenerCart,
    onMutate,
    onSuccess,
    onError: ({ response }) => {
      toast.error(response?.data.message)
    },
  })
}
