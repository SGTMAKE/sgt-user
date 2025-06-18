import { db } from "@/lib/prisma"

type CreateCartProps = {
  userId?: string
  guestUserId?: string
}

type CreateCartItemProps = {
  quantity: number
  color: string | null
  productId?: string // Optional productId
  cartId: string
  customProduct?: any // Optional customProduct
}

async function createGuestUser(expirationDate: Date) {
  return await db.guestUser.create({
    data: {
      expirationDate,
    },
  })
}

async function findGuestUser(guestId: string) {
  return await db.guestUser.findUnique({
    where: {
      id: guestId,
    },
    include: {
      cart: {
        include: {
          cartItems: true,
        },
      },
    },
  })
}

async function findGuestUserWithProduct(guestId: string) {
  return await db.guestUser.findUnique({
    where: {
      id: guestId,
    },
    include: {
      cart: {
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

async function createCart({ userId, guestUserId }: CreateCartProps) {
  return await db.cart.create({
    data: {
      guestUserId,
      userId,
    },
  })
}

async function createCartWithCartItems({ userId, cartItems }: any) {
  return await db.cart.create({
    data: {
      userId,
      cartItems: {
        createMany: {
          data: cartItems.map((cartItem: any) => {
            // For custom products, don't include productId
            if (cartItem.customProduct) {
              return {
                quantity: cartItem.quantity,
                color: cartItem.color,
                customProduct: cartItem.customProduct,
              }
            }
            // For regular products, include productId
            return {
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              color: cartItem.color,
            }
          }),
        },
      },
    },
  })
}

async function createCartItem({ quantity, color, productId, cartId, customProduct }: CreateCartItemProps) {
  // Validate that at least one of productId or customProduct is provided
  if (!productId && !customProduct) {
    throw new Error("Either productId or customProduct must be provided");
  }

  // Ensure customProduct has all required fields for custom products
  if (customProduct) {
    // Make sure customProduct has all required fields
    if (!customProduct.title) {
      customProduct.title = `Custom ${customProduct.options?.fastenerType || "Product"}`
    }

    if (!customProduct.basePrice && customProduct.options?.totalPrice) {
      customProduct.basePrice = customProduct.options.totalPrice
    }

    if (!customProduct.offerPrice && customProduct.options?.totalPrice) {
      customProduct.offerPrice = customProduct.options.totalPrice
    }

    if (!customProduct.image && customProduct.options?.image) {
      customProduct.image = customProduct.options.image
    }

    // For custom products, don't include productId
    return await db.cartItem.create({
      data: {
        quantity,
        color,
        cartId,
        customProduct,
      },
    })
  }

  // For regular products, include productId (we know it exists because of the validation above)
  return await db.cartItem.create({
    data: {
      quantity,
      color,
      productId,
      cartId,
    },
  })
}

async function findCart(userId: string) {
  return await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: true,
    },
  })
}

async function findCartWithProduct(userId: string) {
  return await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  })
}

async function updateCartWithCartItem({ cartId, cartItems }: any) {
  return await db.cart.update({
    where: { id: cartId },
    data: { cartItems: { set: cartItems } },
  })
}

async function findCartItem(itemId: string) {
  return await db.cartItem.findUnique({
    where: {
      id: itemId,
    },
  })
}

async function increaseQuantity(id: string, amount = 1) {
  return await db.cartItem.update({
    where: {
      id,
    },
    data: {
      quantity: {
        increment: amount,
      },
    },
  })
}

async function updateQuantity(itemId: string, quantity: number) {
  return await db.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  })
}

async function deleteCart(cartId: string) {
  return await db.cart.delete({ where: { id: cartId } })
}

async function deleteCartItem(itemId: string) {
  return await db.cartItem.delete({
    where: {
      id: itemId,
    },
  })
}

export {
  createGuestUser,
  createCart,
  createCartWithCartItems,
  createCartItem,
  findGuestUser,
  findGuestUserWithProduct,
  findCart,
  findCartWithProduct,
  updateCartWithCartItem,
  findCartItem,
  increaseQuantity,
  updateQuantity,
  deleteCart,
  deleteCartItem,
}
