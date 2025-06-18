import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  createCart,
  createCartItem,
  createGuestUser,
  findCart,
  findGuestUser,
  findCartItem,
  increaseQuantity,
  updateQuantity,
  deleteCartItem,
} from "./helper"
import { error400, error500, getExpireDate, success200 } from "@/lib/utils"
import { z } from "zod"

// Define validation schemas
const postCartItemSchema = z.object({
  productId: z.string().optional(),
  quantity: z.number().min(1).max(100),
  color: z.string().nullable(),
  customProduct: z.record(z.any()).optional(),
}).refine(data => data.productId || data.customProduct, {
  message: "Either productId or customProduct must be provided",
  path: ["productId"]
});

const patchCartItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1).max(100),
})

type PostBody = z.infer<typeof postCartItemSchema>
type PatchBody = z.infer<typeof patchCartItemSchema>

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    // Validate the request body
    try {
      postCartItemSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return error400("Invalid data format: " + validationError.errors.map((e) => e.message).join(", "), {
          item: null,
        })
      }
      return error400("Invalid data format.", { item: null })
    }

    // Ensure customProduct has all required fields for custom products
    if (body.customProduct) {
      // Make sure customProduct has all required fields
      if (!body.customProduct.title) {
        body.customProduct.title = `Custom ${body.customProduct.options?.fastenerType || "Product"}`
      }

      if (!body.customProduct.basePrice && body.customProduct.options?.totalPrice) {
        body.customProduct.basePrice = body.customProduct.options.totalPrice
      }

      if (!body.customProduct.offerPrice && body.customProduct.options?.totalPrice) {
        body.customProduct.offerPrice = body.customProduct.options.totalPrice
      }

      if (!body.customProduct.image && body.customProduct.options?.image) {
        body.customProduct.image = body.customProduct.options.image
      }
    }

    // Handle guest user case
    if (!session || !session.user || !session.user.id) {
      const guestId = req.cookies.get("guest-id")?.value
      if (!guestId) {
        const newGuestUser = await createGuestUser(getExpireDate())
        const newGuestCart = await createCart({ guestUserId: newGuestUser.id })

        // Create cart item with appropriate fields
        await createCartItem({
          quantity: body.quantity,
          color: body.color,
          productId: body.productId, // Will be undefined for custom products
          cartId: newGuestCart.id,
          customProduct: body.customProduct, // Will be undefined for regular products
        })

        const res = success200({ item: {} })
        res.cookies.set("guest-id", newGuestUser.id)
        return res
      } else {
        const guestUser = await findGuestUser(guestId)
        if (!guestUser) {
          const res = error400("Invalid guest user ID in the cookie.", {
            item: null,
          })
          res.cookies.delete("guest-id")
          return res
        }

        if (!guestUser.cart) {
          const newGuestCart = await createCart({ guestUserId: guestUser.id })
          await createCartItem({
            quantity: body.quantity,
            color: body.color,
            productId: body.productId, // Will be undefined for custom products
            cartId: newGuestCart.id,
            customProduct: body.customProduct, // Will be undefined for regular products
          })
          return success200({ item: {} })
        }

        // For custom products, always create a new item
        if (body.customProduct) {
          await createCartItem({
            quantity: body.quantity,
            color: body.color,
            cartId: guestUser.cart.id,
            customProduct: body.customProduct,
          })
          return success200({ item: {} })
        }

        // For regular products, check if it already exists
        const existingItem = guestUser.cart.cartItems.find(
          (item) => item.productId === body.productId && item.color === body.color,
        )

        if (existingItem) {
          // If the same product exists, increase the quantity
          if (existingItem.quantity >= 10) {
            return error400("Maximum quantity of 10 reached for this item!", {
              item: null,
            })
          }
          await increaseQuantity(existingItem.id)
        } else {
          // Otherwise, create a new cart item
          await createCartItem({
            quantity: body.quantity,
            color: body.color,
            productId: body.productId,
            cartId: guestUser.cart.id,
          })
        }
      }
      return success200({ item: {} })
    }

    // Handle logged-in user case
    const existingCart = await findCart(session.user.id)

    if (!existingCart) {
      const cart = await createCart({ userId: session.user.id })
      await createCartItem({
        quantity: body.quantity,
        color: body.color,
        productId: body.productId, // Will be undefined for custom products
        cartId: cart.id,
        customProduct: body.customProduct, // Will be undefined for regular products
      })
      return success200({ item: {} })
    }

    // For custom products, always create a new item
    if (body.customProduct) {
      await createCartItem({
        quantity: body.quantity,
        color: body.color,
        cartId: existingCart.id,
        customProduct: body.customProduct,
      })
      return success200({ item: {} })
    }

    // For regular products, check if it already exists
    const existingItem = existingCart.cartItems.find(
      (item) => item.productId === body.productId && item.color === body.color,
    )

    if (existingItem) {
      // If the same product exists, increase the quantity
      if (existingItem.quantity >= 10) {
        return error400("Maximum quantity of 10 reached for this item!", {
          item: null,
        })
      }
      await increaseQuantity(existingItem.id)
    } else {
      // Otherwise, create a new cart item
      await createCartItem({
        quantity: body.quantity,
        color: body.color,
        productId: body.productId,
        cartId: existingCart.id,
      })
    }

    return success200({ item: {} })
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate the request body
    try {
      patchCartItemSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return error400("Invalid data format: " + validationError.errors.map((e) => e.message).join(", "), {
          item: null,
        })
      }
      return error400("Invalid data format.", { item: null })
    }

    const cartItem = await findCartItem(body.itemId)

    if (!cartItem) {
      return error400("No matching product found in your cart.", {
        item: null,
      })
    }

    if (body.quantity > 10) {
      return error400("Maximum quantity of 10 reached for this item!", {
        item: null,
      })
    }

    if (body.quantity < 1) {
      return error400("Minimum quantity is 1!", { item: null })
    }

    await updateQuantity(body.itemId, body.quantity)
    return success200({ item: {} })
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const itemId = req.nextUrl.searchParams.get("itemId")

    if (!itemId) {
      return error400("Item ID missing from URL parameters.", {
        item: null,
      })
    }

    // Delete the cart item (works for both regular and custom products)
    const deletedItem = await deleteCartItem(itemId)

    if (!deletedItem) {
      return error400("No such item exists in your cart.", { item: null })
    }

    return success200({ item: {} })
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}

// Import the GET handler from original-route.ts
export { GET } from "./original-route"
