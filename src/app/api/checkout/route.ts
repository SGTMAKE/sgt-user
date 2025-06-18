import { authOptions } from "@/lib/auth"
import { error400, error500, success200 } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { findCartWithProduct } from "../cart/helper"
import type { NextRequest } from "next/server"
import { getImageThumbnail } from "@/lib/cart-utils"
import type { CheckoutItemProps } from "@/lib/types/types"
import { getProductWithImages } from "../payment/helper"
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const checkoutCookie = req.cookies.get("checkout")?.value || ""
    if (checkoutCookie !== "") {
      const decodedItem: CheckoutItemProps = JSON.parse(atob(checkoutCookie))

      // Handle custom products (fasteners)
      if (decodedItem.isCustomProduct ) {
        return success200({
          products: [
            {
              id: decodedItem.productId || `custom-${Date.now()}`,
              quantity: decodedItem.quantity,
              basePrice: decodedItem.basePrice * (decodedItem.quantity !== 0 ? decodedItem.quantity : 1),
              offerPrice: decodedItem.offerPrice * (decodedItem.quantity !== 0 ? decodedItem.quantity : 1),
              title: decodedItem.title || "Custom Product",
              image: decodedItem.image || "/placeholder.svg",
              isCustomProduct: true,
              customProductData: decodedItem.customProductData || {},
            },
          ],
        })
      } else if (decodedItem.productId) {
        // Handle regular products
        const dbProduct = await getProductWithImages(decodedItem.productId)

        if (!dbProduct) {
          return error400("The request is missing or contains an invalid product ID & Product Slug", { products: null })
        }

        return success200({
          products: [
            {
              id: decodedItem.productId,
              quantity: decodedItem.quantity,
              basePrice: dbProduct.basePrice * (decodedItem.quantity !== 0 ? decodedItem.quantity : 1),
              offerPrice: dbProduct.offerPrice * (decodedItem.quantity !== 0 ? decodedItem.quantity : 1),
              title: dbProduct.title,
              image: getImageThumbnail({ images: dbProduct.images }, decodedItem.color||""),
            },
          ],
        })
      } else {
        return error400("Invalid checkout data: missing productId or customProduct", { products: null })
      }
    } else {
      const session = await getServerSession(authOptions)
      if (!session || !session.user || !session.user.id) {
        return error400("Missing user ID in the session.", { user: null })
      }
      const userId = session.user.id
      const cartItems = await findCartWithProduct(userId)
      if (!cartItems || cartItems.cartItems.length === 0) {
        return error400("User cart is empty!", { products: null })
      }

      const checkoutItems = cartItems.cartItems.map((cartItem) => {
        // Handle custom products (fasteners)
        if (cartItem.customProduct && typeof cartItem.customProduct === "object" && "image" in cartItem.customProduct) {
          return {
            id: `custom-${cartItem.id}`,
            quantity: cartItem.quantity,
            basePrice: cartItem.customProduct.basePrice * (cartItem.quantity !== 0 ? cartItem.quantity : 1),
            offerPrice: cartItem.customProduct.offerPrice * (cartItem.quantity !== 0 ? cartItem.quantity : 1),
            title: cartItem.customProduct.title || "Custom Product",
            image: cartItem.customProduct.image || "/placeholder.svg",
            isCustomProduct: true,
            customProductData: cartItem.customProduct,
          }
        } else if (cartItem.productId && cartItem.product) {
          // Handle regular products
          return {
            id: cartItem.productId,
            quantity: cartItem.quantity,
            basePrice: cartItem.product.basePrice * (cartItem.quantity !== 0 ? cartItem.quantity : 1),
            offerPrice: cartItem.product.offerPrice * (cartItem.quantity !== 0 ? cartItem.quantity : 1),
            title: cartItem.product.title,
            image: getImageThumbnail({ images: cartItem.product.images }, cartItem.color),
          }
        } else {
          // This should never happen due to validation, but just in case
          throw new Error("Invalid cart item: missing productId or customProduct")
        }
      })

      return success200({
        products: checkoutItems,
      })
    }
  } catch (error) {
    console.log(error)
    return error500({ products: null })
  }
}
