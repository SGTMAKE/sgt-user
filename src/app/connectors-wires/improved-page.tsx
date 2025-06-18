"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { getCookie, setCookie } from "cookies-next"
import ConnectorForm from "@/components/connectors-wires/connector-form"
import WireForm from "@/components/connectors-wires/wire-form"
import { useAddFastenerToCart } from "@/api-hooks/cart/add-fastener-to-cart"

type TabType = "Harness Wires" | "Silicon Wires" | "Connectors"

export default function ConnectorsWiresPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabType>("Connectors")

  // Set up cart mutation
  const onSuccess = async () => {
    await queryClient.cancelQueries({ queryKey: ["user", "cart"] })
    await queryClient.invalidateQueries(["user", "cart"])
    toast.success("Item successfully added to your cart.")
  }

  const onMutate = async () => {
    if (!session?.user) {
      const guestUserIdCookie = getCookie("guest-id")
      if (!guestUserIdCookie) {
        const guestUserIdLocal = localStorage.getItem("guest-id")
        if (guestUserIdLocal) setCookie("guest-id", guestUserIdLocal)
      }
    }
  }

  const cartMutation = useAddFastenerToCart({ onMutate, onSuccess })

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Format the data for the cart API
    const formattedData = formatDataForCart(data)

    // Add to cart using the same API as fasteners
    cartMutation.mutate({
      quantity: data.quantity,
      color: null, // Connectors and wires use their own color field in options
      customProduct: formattedData,
    })
  }

  // Format the data for the cart API
  const formatDataForCart = (data: any) => {
    let title = ""
    let image = "/placeholder.svg"
    const totalPrice = data.totalPrice || 0

    if (data.productType === "Connectors") {
      title = `${data.connectorType} - ${data.type}`
      if (data.pins) title += ` - ${data.pins} Pins`
      if (data.size) title += ` - ${data.size}`
      image = "/images/connectors/connector.jpg"
    } else if (data.productType === "Silicon Wires") {
      title = `Silicon Wire - ${data.size} - ${data.color} - ${data.length}m`
      image = "/images/wires/silicon-wire.jpg"
    } else if (data.productType === "Harness Wires") {
      title = `Harness Wire - ${data.size} - ${data.color} - ${data.length}m`
      image = "/images/wires/harness-wire.jpg"
    }

    return {
      title,
      basePrice: totalPrice,
      offerPrice: totalPrice,
      image,
      options: {
        ...data,
      },
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connectors & Wires</h1>

      {/* Tab Navigation */}
      <div className="flex mb-6 space-x-4">
        {["Harness Wires", "Silicon Wires", "Connectors"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 rounded-md ${
              activeTab === tab
                ? "border border-orange-500 text-orange-500"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab as TabType)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {activeTab === "Connectors" && <ConnectorForm onSubmit={handleSubmit} isLoading={cartMutation.isLoading} />}

      {activeTab === "Silicon Wires" && (
        <WireForm wireType="Silicon Wires" onSubmit={handleSubmit} isLoading={cartMutation.isLoading} />
      )}

      {activeTab === "Harness Wires" && (
        <WireForm wireType="Harness Wires" onSubmit={handleSubmit} isLoading={cartMutation.isLoading} />
      )}
    </div>
  )
}
