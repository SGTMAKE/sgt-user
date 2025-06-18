import axios from "@/config/axios.config"
import type { CartItemRes } from "@/lib/types/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type UseAddConnectorsWiresToCartProps = {
  onMutate?: () => void
  onSuccess?: () => void
}

// This function handles adding connectors and wires (custom products) to the cart
async function handleConnectorsWiresCart(values: {
  quantity: number
  color: string | null
  customProduct: any
}) {
  const { data } = await axios.post("/api/cart", values)
  return data as CartItemRes
}

export function useAddConnectorsWiresToCart({ onMutate, onSuccess }: UseAddConnectorsWiresToCartProps = {}) {
  return useMutation({
    mutationFn: handleConnectorsWiresCart,
    onMutate,
    onSuccess,
    onError: ({ response }) => {
      toast.error(response?.data.message)
    },
  })
}
