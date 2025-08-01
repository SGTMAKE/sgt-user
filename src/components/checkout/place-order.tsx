"use client"

import Script from "next/script"
import { usePayment } from "@/api-hooks/payment/handle-payment"
import type { PaymentRes } from "@/lib/types/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useGlobalContext } from "@/context/store"
import PaymentProcessingDialog from "../dialog/payment-processing-dialog"
import { useState } from "react"
import { Button } from "@nextui-org/button"
import { useCurrency } from "@/context/currency-context"

const PlaceOrder = () => {
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const payment_mutation = usePayment(makePayment)
  const { deliveryAddress } = useGlobalContext()
  const { selectedCurrency , getExchangeRate } = useCurrency()

  function makePayment(data: PaymentRes) {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      name: "SGT Make",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Thank You for Your Purchase!",
      image: "/favicon.ico",
      prefill: {
        name: deliveryAddress?.name || "",
        contact: deliveryAddress?.phone || "",
      },
      notes: {
        address: deliveryAddress?.address || "",
        currency: selectedCurrency.code,
      },
      theme: {
        color: "#f97316",
      },
      handler: async (response: any) => {
        if (response.razorpay_signature) {
          const payload = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
          }

          const res = await fetch("/api/payment/verify", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              "x-razorpay-signature": response.razorpay_signature,
            },
          })
          router.push(`/checkout/${data.orderId}`)
        } else {
          toast.error("Payment failed. Please contact support!")
        }
      },
     
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
    paymentObject.on("payment.failed", () => {
      paymentObject.close()
      toast.error("Payment failed. Please contact support!")
    })
    setProcessing(false)
  }

  function placeOrder() {

   
    setProcessing(true)
    if (deliveryAddress?.id) payment_mutation.mutate({ addressId: deliveryAddress.id, currency: selectedCurrency.code, exchangeRate: getExchangeRate() })
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button
        color="primary"
        onClick={placeOrder}
        isLoading={payment_mutation.isLoading}
        isDisabled={!deliveryAddress?.id}
        className="w-full"
      >
        Place order
      </Button>
      {processing && <PaymentProcessingDialog open={processing} />}
    </>
  )
}

export default PlaceOrder
