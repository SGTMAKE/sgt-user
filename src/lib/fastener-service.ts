import { z } from "zod"

// Define the fastener cart item schema
export const fastenerCartItemSchema = z.object({
  quantity: z.number().min(1).max(100),
  totalPrice: z.number().min(0),
  fastenerType: z.string(),
  image: z.string(),
  // All the selected options will be stored in customProduct
  customProduct: z.record(z.any()),
})

export type FastenerCartItem = z.infer<typeof fastenerCartItemSchema>

// Function to add a fastener to the cart
export async function addFastenerToCart(formData: any): Promise<void> {
  try {
    // Format the title based on the selected options
    const title = formatFastenerTitle(formData)

    // Calculate the price (use totalPrice from formData)
    const price = formData.totalPrice || 0

    // Get the image path
    const imagePath = formData.image || "/placeholder.svg"

    // Prepare the cart item - don't include productId for custom products
    const cartItem = {
      quantity: formData.quantity,
      color: null, // Fasteners don't use the color system
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
      throw new Error(errorData.message || "Failed to add fastener to cart")
    }

    return
  } catch (error) {
    console.error("Error adding fastener to cart:", error)
    throw error
  }
}

// Helper function to format the fastener title
function formatFastenerTitle(formData: any): string {
  const { fastenerType, ...options } = formData

  // Create a descriptive title based on the selected options
  const parts: string[] = [fastenerType]

  // Add size if available
  if (options.size) {
    parts.push(options.size)
  }

  // Add material if available
  if (options.material) {
    parts.push(options.material)
  }

  // Add length for bolts
  if (options.length) {
    parts.push(`${options.length}mm`)
  }

  // Add type information
  if (options.type) {
    parts.push(options.type)
  }

  // Add head type for bolts
  if (options.headType) {
    parts.push(`${options.headType} Head`)
  }

  return parts.join(" - ")
}
