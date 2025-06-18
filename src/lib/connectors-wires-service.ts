import { z } from "zod"

// Define the connectors and wires cart item schema
export const connectorsWiresCartItemSchema = z.object({
  quantity: z.number().min(1).max(100),
  productType: z.enum(["Connectors", "Silicon Wires", "Harness Wires"]),

  // Common fields
  remarks: z.string().optional(),
  totalPrice: z.number().min(0),

  // Connector specific fields
  connectorType: z.string().optional(),
  type: z.string().optional(),
  pins: z.string().optional(),

  // Wire specific fields
  size: z.string().optional(),
  color: z.string().optional(),
  length: z.string().optional(),
})

export type ConnectorsWiresCartItem = z.infer<typeof connectorsWiresCartItemSchema>

// Function to add a connector or wire to the cart
export async function addConnectorsWiresToCart(formData: any): Promise<void> {
  try {
    // Format the title based on the selected options
    const title = formatTitle(formData)

    // Calculate the price
    const price = formData.totalPrice || 0

    // Get the image path
    const imagePath = getImagePath(formData)

    // Prepare the cart item
    const cartItem = {
      quantity: formData.quantity,
      color: null, // Connectors and wires don't use the color system in the same way
      customProduct: {
        title,
        basePrice: price,
        offerPrice: price,
        image: imagePath,
        options: { ...formData },
      },
    }

    // Call the cart API to add the item
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add item to cart")
    }

    return
  } catch (error) {
    console.error("Error adding item to cart:", error)
    throw error
  }
}

// Helper function to format the title
function formatTitle(formData: any): string {
  if (formData.productType === "Connectors") {
    let title = `${formData.connectorType} - ${formData.type}`
    if (formData.pins) title += ` - ${formData.pins} Pins`
    if (formData.size) title += ` - ${formData.size}`
    return title
  } else if (formData.productType === "Silicon Wires") {
    return `Silicon Wire - ${formData.size} - ${formData.color} - ${formData.length}m`
  } else if (formData.productType === "Harness Wires") {
    return `Harness Wire - ${formData.size} - ${formData.color} - ${formData.length}m`
  }
  return "Custom Product"
}

// Helper function to get the image path
function getImagePath(formData: any): string {
  if (formData.productType === "Connectors") {
    return "/images/connectors/connector.jpg"
  } else if (formData.productType === "Silicon Wires") {
    return "/images/wires/silicon-wire.jpg"
  } else if (formData.productType === "Harness Wires") {
    return "/images/wires/harness-wire.jpg"
  }
  return "/placeholder.svg"
}
