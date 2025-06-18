import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  createCartWithCartItems,
  deleteCart,
  findCart,
  findCartWithProduct,
  findGuestUser,
  findGuestUserWithProduct,
  updateCartWithCartItem,
} from "./helper"
import { error400, error500, success200 } from "@/lib/utils"
import { getImageThumbnail, makeUrl } from "@/lib/cart-utils"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const guestId = req.cookies.get("guest-id")?.value

    if (!session || !session.user || !session.user.id) {
      if (!guestId) {
        return success200({ item: [] })
      }

      const guestUser = await findGuestUserWithProduct(guestId)

      if (!guestUser || !guestUser.cart) {
        const res = error400("Invalid Guest ID.", { item: null })
        res.cookies.delete("guest-id")
        return res
      }

      const cartItemsArray = guestUser.cart.cartItems.map((cartItem) => {
        // Handle custom products (fasteners)
        if (cartItem.customProduct && typeof cartItem.customProduct === 'object' && 'image' in cartItem.customProduct) {
          return {
            itemId: cartItem.id,
            pid: `custom-${cartItem.id}`, // Use the cartItem.id as a unique identifier
            title: cartItem.customProduct.title || `Custom Fastener`,
            image: cartItem.customProduct.image || "/placeholder.svg",
            basePrice: cartItem.customProduct.basePrice || 0,
            offerPrice: cartItem.customProduct.offerPrice || 0,
            color: null,
            quantity: cartItem.quantity,
            url: "/fasteners",
            customProduct: cartItem.customProduct,
          }
        }

        // Handle regular products
        if (cartItem.productId && cartItem.product) {
          return {
            itemId: cartItem.id,
            pid: cartItem.productId,
            slug: cartItem.product?.slug,
            title: cartItem.product?.title,
            image: getImageThumbnail({ images: cartItem.product?.images || [] }, cartItem.color),
            basePrice: cartItem.product?.basePrice,
            offerPrice: cartItem.product?.offerPrice,
            color: cartItem.color,
            quantity: cartItem.quantity,
            url: cartItem.product ? makeUrl(cartItem.product.slug, cartItem.productId, cartItem.color) : "",
          }
        }

        // Fallback for invalid items
        return {
          itemId: cartItem.id,
          pid: "unknown",
          title: "Unknown Product",
          image: "/placeholder.svg",
          basePrice: 0,
          offerPrice: 0,
          color: null,
          quantity: cartItem.quantity,
          url: "",
        }
      })

      return success200({ item: cartItemsArray.reverse() })
    }

    const userId = session.user.id

    if (guestId) {
      // Retrieve the guest user and their cart
      const guestUser = await findGuestUser(guestId)

      if (guestUser && guestUser.cart) {
        // Retrieve the user's cart
        const userCart = await findCart(userId)

        if (userCart) {
          // Iterate over guest user's cart items and merge into the user's cart
          guestUser.cart.cartItems.forEach((guestCartItem) => {
            // For custom products, always add as new item
            if (guestCartItem.customProduct) {
              userCart.cartItems.push(guestCartItem)
              return
            }

            // For regular products, check if it exists
            if (guestCartItem.productId) {
              const existingUserCartItem = userCart.cartItems.find(
                (userCartItem) =>
                  userCartItem.productId === guestCartItem.productId && userCartItem.color === guestCartItem.color,
              )

              if (!existingUserCartItem) {
                // If the same product doesn't exist, add the guest cart item to the user's cart
                userCart.cartItems.push(guestCartItem)
              }
            }
          })

          // Save the updated user's cart
          await updateCartWithCartItem({
            cartId: userCart.id,
            cartItems: userCart.cartItems,
          })
        } else {
          // If the user doesn't have a cart, create a new cart for them
          await createCartWithCartItems({
            userId,
            cartItems: guestUser.cart.cartItems,
          })
        }
        // Delete the guest user's cart
        await deleteCart(guestUser.cart.id)
      }
    }

    const cart = await findCartWithProduct(userId)

    if (!cart || cart.cartItems.length === 0) {
      const res = success200({ item: [] })
      res.cookies.delete("guest-id")
      return res
    }

    const cartItemsArray = cart.cartItems.map((cartItem) => {
      // Handle custom products (fasteners)
      if (cartItem.customProduct && typeof cartItem.customProduct === 'object' && 'image' in cartItem.customProduct) {
        return {
          itemId: cartItem.id,
          pid: `custom-${cartItem.id}`, // Use the cartItem.id as a unique identifier
          title: cartItem.customProduct.title || `Custom Fastener`,
          image: cartItem.customProduct.image || "/placeholder.svg",
          basePrice: cartItem.customProduct.basePrice || 0,
          offerPrice: cartItem.customProduct.offerPrice || 0,
          color: null,
          quantity: cartItem.quantity,
          url: "/fasteners",
          customProduct: cartItem.customProduct,
        }
      }

      // Handle regular products
      if (cartItem.productId && cartItem.product) {
        return {
          itemId: cartItem.id,
          pid: cartItem.productId,
          slug: cartItem.product?.slug,
          title: cartItem.product?.title,
          image: getImageThumbnail({ images: cartItem.product?.images || [] }, cartItem.color),
          basePrice: cartItem.product?.basePrice,
          offerPrice: cartItem.product?.offerPrice,
          color: cartItem.color,
          quantity: cartItem.quantity,
          url: cartItem.product ? makeUrl(cartItem.product.slug, cartItem.productId, cartItem.color) : "",
        }
      }

      // Fallback for invalid items
      return {
        itemId: cartItem.id,
        pid: "unknown",
        title: "Unknown Product",
        image: "/placeholder.svg",
        basePrice: 0,
        offerPrice: 0,
        color: null,
        quantity: cartItem.quantity,
        url: "",
      }
    })

    const res = success200({ item: cartItemsArray.reverse() })
    res.cookies.delete("guest-id")
    return res
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}
