"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface QuoteItem {
  id: string
  type: "fastener" | "connector" | "wire"
  categoryName: string
  title: string
  quantity: number
  specifications: any
  image?: string
}

interface QuoteCartStore {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

export const useQuoteCart = create<QuoteCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "quote-cart-storage",
    },
  ),
)
