import type { NextRequest } from "next/server"
import crypto from "crypto"
import { error400, error500, success200 } from "@/lib/utils"
import { createPayment, updateOrder } from "../helper"
import { db } from "@/lib/prisma"
import { razorpay } from "../route"
import { headers } from "next/headers"

const getPaymentVia = (method: string, payload: any) => {
  if (method === "netbanking") return payload["bank"]
  else if (method === "wallet") return payload["wallet"]
  else if (method === "upi") return payload["vpa"]
  else if (method === "card") {
    return payload["card"].last4 + "," + payload["card"].network
  } else return null
}


export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const payloadEntity = await razorpay.payments.fetch(data.payment_id)
    const order_id = payloadEntity.order_id.split("_")[1].toUpperCase()
    console.log("verify")

    if (data.event === "payment.failed") {
      console.log("failed")
      await db.order.delete({
        where: {
          orderID: order_id,
        },
      })
      return error400("Payment failed", { verified: false })
    }
    console.log("pass")
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET!)

    shasum.update(`${data.order_id}|${data.payment_id}`)
    const digest = shasum.digest("hex")



    if (digest === headers().get("x-razorpay-signature")) {
      console.log("payment verifed")
      const successOrder = await updateOrder(order_id)

      // Update product stock for regular products only
      for (const order of successOrder.orderItems) {
        if (order.productId) {
          // Only update stock for regular products
          try {
            await db.product.update({
              where: {
                id: order.productId,
              },
              data: {
                stock: {
                  decrement: order.quantity,
                },
                purchases:{
                  increment:order.quantity
                }
              },
            })
          } catch (error) {
            console.log(error)
            // Continue processing other items even if one fails
          }
        }
      }

      await createPayment({
        rzr_order_id: payloadEntity.order_id,
        rzr_payment_id: payloadEntity.id,
        orderId: successOrder.id,
        method:
          payloadEntity.method === "card" ? (payloadEntity["card"]?.type ?? "unknown") + " card" : payloadEntity.method,
        via: getPaymentVia(payloadEntity.method, payloadEntity),
        amount: Number(payloadEntity.amount) / 100,
      })
    } else {
      return error400("Payment Signatures Do Not Match. Please contact support for help", {
        verified: false,
      })
    }
    return success200({ verified: true })
  } catch (error) {
    console.log(error)
    return error500({ verified: false })
  }
}