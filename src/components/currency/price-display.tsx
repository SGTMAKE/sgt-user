"use client"

import { useCurrency } from "@/context/currency-context"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  /** Price amount in INR (base currency) */
  amount: number
  /** Additional CSS classes */
  className?: string
  /** Show currency symbol */
  showSymbol?: boolean
  /** Show currency code */
  showCode?: boolean
  /** Custom formatting options */
  formatOptions?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
}

export function PriceDisplay({
  amount,
  className,
  showSymbol = true,
  showCode = false,
  formatOptions,
}: PriceDisplayProps) {
  const { selectedCurrency, convertFromINR, isLoading } = useCurrency()

  if (isLoading) {
    return <span className={cn("animate-pulse bg-gray-200 rounded h-4 w-16 inline-block", className)} />
  }

  const convertedAmount = convertFromINR(amount)

  const formatter = new Intl.NumberFormat(selectedCurrency.locale, {
    style: showSymbol ? "currency" : "decimal",
    currency: selectedCurrency.code,
    minimumFractionDigits: formatOptions?.minimumFractionDigits ?? 0,
    maximumFractionDigits: formatOptions?.maximumFractionDigits ?? 2,
  })

  const formattedPrice = formatter.format(convertedAmount)

  return (
    <span className={cn("font-medium", className)}>
      {formattedPrice}
      {showCode && !showSymbol && ` ${selectedCurrency.code}`}
    </span>
  )
}

// Specialized components for common use cases
export function ProductPrice({
  amount,
  className,
  originalPrice,
}: {
  amount: number
  className?: string
  originalPrice?: number
}) {
  return (
    <span className=" space-x-2 flex flex-wrap items-center">
      <PriceDisplay amount={amount} className={cn("text-lg font-bold ", className)} />
      {originalPrice && originalPrice > amount && (
        <PriceDisplay amount={originalPrice} className="text-sm text-gray-500 line-through" />
      )}
    </span>
  )
}

export function CartPrice({ amount, className }: { amount: number; className?: string }) {
  return <PriceDisplay amount={amount} className={cn("text-base font-semibold", className)} />
}

export function TotalPrice({ amount, className }: { amount: number; className?: string }) {
  return <PriceDisplay amount={amount} className={cn("text-xl font-bold text-primary", className)} />
}

export function CompactPrice({ amount, className }: { amount: number; className?: string }) {
  return <PriceDisplay amount={amount} className={cn("text-sm", className)} />
}
