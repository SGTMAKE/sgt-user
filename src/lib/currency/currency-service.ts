export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
]

export class CurrencyService {
  private static instance: CurrencyService
  private exchangeRates: { [key: string]: number } = { INR: 1 }
  private lastUpdated: Date | null = null
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  async updateExchangeRates(): Promise<void> {
    
        this.exchangeRates = {
          INR: 1,
          USD: 0.01146, // Fallback rate
        }
        this.lastUpdated = new Date()

        // Cache in localStorage
        localStorage.setItem("exchangeRates", JSON.stringify(this.exchangeRates))
        localStorage.setItem("ratesLastUpdated", this.lastUpdated.toISOString())
  }

  private loadCachedRates(): void {
    try {
      const cachedRates = localStorage.getItem("exchangeRates")
      const lastUpdated = localStorage.getItem("ratesLastUpdated")

      if (cachedRates && lastUpdated) {
        this.exchangeRates = JSON.parse(cachedRates)
        this.lastUpdated = new Date(lastUpdated)
      }
    } catch (error) {
      console.error("Failed to load cached rates:", error)
      // Use fallback rates
      this.exchangeRates = { INR: 1, USD: 0.01146 }
    }
  }

  shouldUpdateRates(): boolean {
    if (!this.lastUpdated) return true
    const now = new Date()
    return now.getTime() - this.lastUpdated.getTime() > this.CACHE_DURATION
  }

  getExchangeRate(currency: Currency): number {
    return this.exchangeRates[currency.code] || 1
  }

  convertFromINR(amountInINR: number, targetCurrency: Currency): number {
    const rate = this.getExchangeRate(targetCurrency)
    return amountInINR * rate
  }

  convertToINR(amount: number, fromCurrency: Currency): number {
    const rate = this.getExchangeRate(fromCurrency)
    return amount / rate
  }

  formatCurrency(amountInINR: number, currency: Currency): string {
    const convertedAmount = this.convertFromINR(amountInINR, currency)

    const formatter = new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    return formatter.format(convertedAmount)
  }
}
