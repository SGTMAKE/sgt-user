"use client"

import Script from "next/script"
import { usePayment } from "@/api-hooks/payment/handle-payment"
import type { PaymentRes } from "@/lib/types/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useGlobalContext } from "@/context/store"
import PaymentProcessingDialog from "../dialog/payment-processing-dialog"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/button"
import { useCurrency } from "@/context/currency-context"
import { ProductPrice } from "../currency/price-display"
import { Country, State, City } from "country-state-city"
import { useShipping } from "@/context/shipping-context"
import { Skeleton } from "@nextui-org/skeleton"
import { motion } from "framer-motion"
type PriceDetailsProps = {
  subtotal: number
  total: number
}
const PlaceOrder = ({ subtotal, total }: PriceDetailsProps) => {
  const [processing, setProcessing] = useState(false)

  const router = useRouter()
  const {currentShipping,calculateShipping,isLoading  } = useShipping()

  const payment_mutation = usePayment(makePayment)
  const { deliveryAddress } = useGlobalContext()
  const { selectedCurrency , getExchangeRate } = useCurrency()

const freeShippingThreshold = currentShipping?.freeShippingThreshold || 0

// % progress towards free shipping
const progressValue = freeShippingThreshold
  ? Math.min((total / freeShippingThreshold) * 100, 100)
  : 0

// Amount remaining for free shipping
const remaining = freeShippingThreshold > total
  ? freeShippingThreshold - total
  : 0

  useEffect(() => {
      const countryData = Country.getAllCountries().find((c) => c.name === deliveryAddress?.country)
      if (countryData) {
        const ship = calculateShipping(countryData.isoCode, total)
        console.log(ship)
      }
  }, [subtotal,deliveryAddress])
  

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
    if (deliveryAddress?.id) payment_mutation.mutate({ addressId: deliveryAddress.id, currency: selectedCurrency.code, exchangeRate: getExchangeRate() , shippingCost: currentShipping?.shippingCost || 0})
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="col-span-2 md:col-start-2">
        {freeShippingThreshold > 0 && (
  <div className="w-full my-6">
      {/* Progress bar wrapper */}
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      {/* Status text */}
      <p className="mt-2 text-sm text-center">
        {progressValue === 100 ? (
          <span className="text-green-600 font-medium">
            🎉 You unlocked Free Shipping!
          </span>
        ) : (
          <span className="text-gray-600 flex flex-wrap gap-2  text-center">
            Add{" "}
            <ProductPrice
              amount={remaining}
              className="font-semibold text-orange-600 text-sm "
            />{" "}
            more to unlock{" "}
            <span className="font-bold text-gray-800">Free Shipping</span>
          </span>
        )}
      </p>
    </div>
)}

            <div className="my-2 grid grid-cols-2 text-[.9rem]">
              <p className="text-muted-foreground">Item Subtotal</p>
              <div className="text-right "><ProductPrice amount={subtotal} className="font-medium font-Roboto text-[.9rem] text-right ml-auto" /></div>
            </div>
            <div className="my-2 grid grid-cols-2 text-[.9rem]">
              <p className="text-muted-foreground">Item Discount</p>
              <div className="text-right flex ml-auto text-green-500"><span>-</span> <ProductPrice amount={subtotal-total} className="font-medium font-Roboto text-[.9rem] text-right  " /></div>
            </div>
            <div className="my-2 grid grid-cols-2 text-[.9rem]">
              <p className="text-muted-foreground">Shipping Fee</p>
              <p className="text-right font-Roboto font-medium ">{isLoading? <Skeleton className="h-5 w-14" /> :currentShipping?.shippingCost ? <ProductPrice amount={currentShipping?.shippingCost} className="font-medium font-Roboto text-[.9rem] text-right ml-auto" /> : <span className=" text-green-500"> Free </span> }</p>
            </div>
            <hr className="my-5" />
            <div className="my-2 grid grid-cols-2 items-center text-[.9rem]">
              <p className="text-muted-foreground">Total</p>
              <div className="text-right "><ProductPrice amount={total+(currentShipping?.shippingCost || 0)} className="font-medium font-Roboto text-[.9rem] text-right ml-auto" /></div>
            </div>
          
      <Button
        color="primary"
        onClick={placeOrder}
        isLoading={payment_mutation.isLoading}
        isDisabled={!deliveryAddress?.id || isLoading}
        className="w-full"
      >
        Place order
      </Button>
      </div>
      {processing && <PaymentProcessingDialog open={processing} />}
    </>
  )
}

export default PlaceOrder
