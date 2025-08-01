import { formatCurrency } from "@/lib/utils"
import PlaceOrder from "./place-order"
import { ProductPrice } from "../currency/price-display"

type PriceDetailsProps = {
  subtotal: number
  total: number
}

const PriceDetails = ({ subtotal, total }: PriceDetailsProps) => {
  return (
    <div className="col-span-2 md:col-start-2">
      <div className="my-2 grid grid-cols-2 text-[.9rem]">
        <p className="text-muted-foreground">Item Subtotal</p>
        <div className="text-right "><ProductPrice amount={subtotal} className="font-medium font-Roboto text-[.9rem] text-right" /></div>
      </div>
      <div className="my-2 grid grid-cols-2 text-[.9rem]">
        <p className="text-muted-foreground">Item Discount</p>
        <div className="text-right "><ProductPrice amount={subtotal-total} className="font-medium font-Roboto text-[.9rem] text-right" /></div>
      </div>
      <div className="my-2 grid grid-cols-2 text-[.9rem]">
        <p className="text-muted-foreground">Shipping Fee</p>
        <span className="text-right font-Roboto font-medium text-green-500">Free</span>
      </div>
      <hr className="my-5" />
      <div className="my-2 grid grid-cols-2 items-center text-[.9rem]">
        <p className="text-muted-foreground">Total</p>
        <div className="text-right "><ProductPrice amount={total} className="font-medium font-Roboto text-[.9rem] text-right" /></div>
      </div>
      <PlaceOrder />
    </div>
  )
}

export default PriceDetails
