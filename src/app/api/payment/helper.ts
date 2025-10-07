import { db } from "@/lib/prisma"

async function getProductWithImages(productId: string) {
  return await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
       images: {
         orderBy: {
          sequence: 'desc', // 👈 equivalent to MongoDB sequence: -1
        },
      },
    },
  })
}

async function getCartItems(userId: string) {
  return await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        select: {
          product: {
            select: {
              offerPrice: true,
              basePrice: true,
            },
          },
          quantity: true,
          color: true,
          productId: true,
          customProduct: true, // Include customProduct field
          id: true, // Include the ID for reference
        },
      },
    },
  })
}

async function createOrder(orderId: string, amount: number, userId: string, addressId: string, orderItems: any[], currency?: string,shippingCost?:number) {
  // Create the order first
  const order = await db.order.create({
    data: {
      orderID: orderId,
      total: amount,
      userId,
      addressId,
      currency,
      shippingCost
    },
  })

  // Then create each order item individually to handle custom products
  for (const item of orderItems) {
    if (item.customProduct) {
      // For custom products, don't include productId
      await db.orderItem.create({
        data: {
          orderId: order.id,
          quantity: item.quantity,
          color: item.color,
          basePrice: item.basePrice,
          offerPrice: item.offerPrice,
          customProduct: item.customProduct,
        },
      })
    } else if (item.productId) {
      // For regular products, include productId
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          basePrice: item.basePrice,
          offerPrice: item.offerPrice,
        },
      })
    } else {
      // This should never happen due to validation, but just in case
      throw new Error("Order item must have either productId or customProduct")
    }
  }

  return order
}

async function updateOrder(order_id: string) {
  return await db.order.update({
    data: {
      payment_verified: true,
      status: "placed",
    },
    where: {
      orderID: order_id,
    },
    include: {
      orderItems: {
        include:{
          product:{
            include:{
              images:true
            }
          }
        }
      },
      address:true,
    },
  })
}

async function createPayment(values: any) {
  return await db.payment.create({
    data: values,
  })
}

async function getOrderWithItems(orderId: string) {
  return await db.order.findUnique({
    where: {
      orderID: orderId,
    },
    include: {
      address: true,
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      payment: true,
    },
  })
}

export async function getShippingPrice(addressId:string,userId: string, totalAmount: number) {
  // Step 1: Get user's default address
  const address = await db.address.findFirst({
    where: {
      userId,
      id: addressId,
      is_deleted: false,
    },
    select: {
      id: true,
      country: true,
    },
  })

  if (!address) {
    throw new Error("No default address found for the user")
  }
  

  // Step 2: Get shipping rate based on country
  const shippingRate = await db.shippingRate.findFirst({
    where: {
      countryName: address.country, // assuming countryCode = "IN", "US", etc.
    },
  })

  if (!shippingRate || !shippingRate.isActive) {
    throw new Error("Shipping not available for this region")
  }

  // Step 3: Determine final shipping price
  let shippingPrice = shippingRate.baseRate

  if (
    shippingRate.freeShippingThreshold &&
    totalAmount >= shippingRate.freeShippingThreshold
  ) {
    shippingPrice = 0
  }

  return shippingPrice

}

export { getCartItems, getProductWithImages, createOrder, updateOrder, createPayment, getOrderWithItems }