"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Currency, SUPPORTED_CURRENCIES, CurrencyService } from "@/lib/currency/currency-service"

interface CurrencyContextType {
  selectedCurrency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amountInINR: number) => string
  convertFromINR: (amountInINR: number) => number
  convertToINR: (amount: number) => number
  supportedCurrencies: Currency[]
  isLoading: boolean
  getExchangeRate: () => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]) // Default to INR
  const [isLoading, setIsLoading] = useState(true)
  const currencyService = CurrencyService.getInstance()

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem("selectedCurrency")
    if (savedCurrency) {
      const currency = SUPPORTED_CURRENCIES.find((c) => c.code === savedCurrency)
      if (currency) {
        setSelectedCurrency(currency)
      }
    }

    // Update exchange rates if needed
    if (currencyService.shouldUpdateRates()) {
      currencyService.updateExchangeRates().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [currencyService])

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    localStorage.setItem("selectedCurrency", currency.code)
  }

  const formatCurrency = (amountInINR: number): string => {
    return currencyService.formatCurrency(amountInINR, selectedCurrency)
  }

  const convertFromINR = (amountInINR: number): number => {
    return currencyService.convertFromINR(amountInINR, selectedCurrency)
  }

  const convertToINR = (amount: number): number => {
    return currencyService.convertToINR(amount, selectedCurrency)
  }

  const getExchangeRate = (): number => {
    return currencyService.getExchangeRate(selectedCurrency)
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setCurrency,
        formatCurrency,
        convertFromINR,
        convertToINR,
        supportedCurrencies: SUPPORTED_CURRENCIES,
        isLoading,
        getExchangeRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
