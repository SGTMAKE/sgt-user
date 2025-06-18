import type React from "react"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"

// Define the props type explicitly
interface ItemSummaryProps {
  imageUrl: string
  title: string
  quantity: number
  basePrice: number
  isCustomProduct?: boolean
  customProductData?: any
}

const ItemSummary: React.FC<ItemSummaryProps> = ({
  imageUrl,
  title,
  quantity,
  basePrice,
  isCustomProduct,
  customProductData,
}) => {
  // Determine the image source based on whether it's a custom product
  const imageSrc = isCustomProduct
    ? imageUrl // For custom products, imageUrl is already the full URL
    : process.env.NEXT_PUBLIC_IMAGE_URL + imageUrl // For regular products, prepend the base URL

  return (
    <>
      <div className="flex items-center gap-4 px-5 py-4">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt="product image"
          className="rounded-md border border-gray-300 bg-gray-100"
          width={60}
          height={60}
        />
        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <h3 className="max-w-md truncate text-sm">{title}</h3>
            {/* Display custom product details if available */}
            {isCustomProduct && customProductData?.options && (
              <div className="mt-1">
                {Object.entries(customProductData.options).map(([key, value]) => {
                  // Skip non-display fields
                  if (["quantity", "remarks", "totalPrice", "fastenerType", "image"].includes(key)) {
                    return null
                  }
                  return (
                    <p key={key} className="text-xs text-gray-600">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value as string}
                    </p>
                  )
                })}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2">
            <p className="flex items-center gap-0.5 md:justify-center">
              <span className="text-xs">&#x2716;</span>
              {quantity}
            </p>
            <h1 className="text-right font-Roboto font-medium">{formatCurrency(basePrice)}</h1>
          </div>
        </div>
      </div>
      <hr className="mx-5" />
    </>
  )
}

export default ItemSummary
