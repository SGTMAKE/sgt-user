"use client"

import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useAddFastenerToCart } from "@/api-hooks/cart/add-fastener-to-cart"
import { useQueryClient } from "@tanstack/react-query"
import { deleteCookie, getCookie, setCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { Button } from "@nextui-org/button"

type FastenerActionsProps = {
  fastenerData: any // The complete fastener data including all options
  quantity: number
}

const FastenerActions = ({ fastenerData, quantity }: FastenerActionsProps) => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()

  async function onSuccess() {
    await queryClient.cancelQueries({ queryKey: ["user", "cart"] })
    await queryClient.invalidateQueries(["user", "cart"])
    toast.success("Fastener successfully added to your shopping cart.")
    fastener_mutation.reset()
  }

  async function onMutate() {
    if (!session?.user) {
      const guestUserIdCookie = getCookie("guest-id")
      if (!guestUserIdCookie) {
        const guestUserIdLocal = localStorage.getItem("guest-id")
        if (guestUserIdLocal) setCookie("guest-id", guestUserIdLocal)
      }
    }
  }

  const fastener_mutation = useAddFastenerToCart({ onMutate, onSuccess })

  function addToCart() {
    // Format the fastener data for the cart
    const customProduct = {
      title: fastenerData.title || `Custom ${fastenerData.fastenerType}`,
      basePrice: fastenerData.basePrice || 0,
      offerPrice: fastenerData.basePrice || 0,
      image: fastenerData.image || "/placeholder.svg",
      options: { ...fastenerData }, // Store all the original options
    }

    fastener_mutation.mutate({
      quantity: quantity,
      color: null, // Fasteners don't use color
      customProduct,
    })
  }

  function buyNow() {
    if (!session?.user) {
      return router.push(`/authentication`)
    }

    // Format the fastener data for checkout
    const customProduct = {
      title: fastenerData.title || `Custom ${fastenerData.fastenerType}`,
      basePrice: fastenerData.totalPrice || 0,
      offerPrice: fastenerData.totalPrice || 0,
      image: fastenerData.image || "/placeholder.svg",
      options: { ...fastenerData }, // Store all the original options
    }

    const item = {
      productId: `custom-${Date.now()}`, // Generate a unique ID
      quantity: quantity,
      color: null,
      basePrice: fastenerData.totalPrice || 0,
      offerPrice: fastenerData.totalPrice || 0,
      title: customProduct.title,
      image: customProduct.image,
      isCustomProduct: true,
      customProductData: customProduct,
    }

    deleteCookie("checkout")
    setCookie("checkout", btoa(JSON.stringify(item)), {
      maxAge: 60 * 10,
    })
    router.push("/checkout")
  }

  return (
    <div className="mt-6 space-y-4">
      <Button
        isLoading={fastener_mutation.isLoading}
        radius="none"
        color="primary"
        size="lg"
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={addToCart}
      >
        Add to cart
      </Button>
      {/* <Button onClick={buyNow} radius="none" color="danger" size="lg" className="w-full uppercase bg-orange-500">
        Buy it now
      </Button> */}
    </div>
  )
}

export default FastenerActions
