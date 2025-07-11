"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, FileText } from "lucide-react"
import { Button } from "@nextui-org/button"
import { toast } from "sonner"

interface QuoteItem {
  id: string
  type: "fastener" | "connector" | "wire"
  categoryName: string
  title: string
  quantity: number
  specifications: any
  image?: string
}

interface QuoteCartProps {
  items: QuoteItem[]
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onSubmitQuote: (notes: string) => Promise<void>
  isSubmitting?: boolean
}

export default function QuoteCart({
  items,
  onRemoveItem,
  onClearCart,
  onSubmitQuote,
  isSubmitting = false,
}: QuoteCartProps) {
  const [notes, setNotes] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Please add items to your quote request")
      return
    }

    try {
      await onSubmitQuote(notes)
      setNotes("")
      toast.success("Quote request submitted successfully!")
    } catch (error) {
      toast.error("Failed to submit quote request")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fastener":
        return "🔩"
      case "connector":
        return "🔌"
      case "wire":
        return "🔗"
      default:
        return "📦"
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items in quote request</h3>
        <p className="text-gray-500">Add fasteners, connectors, or wires to request a quote</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="bg-orange-500 text-white p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-lg font-semibold">Quote Request</h3>
          <p className="text-orange-100 text-sm">{totalItems} items</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-orange-600"
            onClick={(e) => {
              e.stopPropagation()
              onClearCart()
            }}
          >
            Clear All
          </Button>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            ▼
          </motion.div>
        </div>
      </div>

      {/* Items List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xl">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">{item.categoryName}</p>
                      <p className="text-sm text-orange-600 font-medium">Qty: {item.quantity}</p>

                      {/* Key specifications */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(item.specifications)
                          .filter(([key, value]) => key !== "quantity" && key !== "remarks" && value && value !== "")
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {Array.isArray(value) ? value.join(", ") : value?.toString()}
                            </span>
                          ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Notes Section */}
            <div className="p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Any specific requirements, deadlines, or additional information..."
              />
            </div>

            {/* Submit Button */}
            <div className="p-4 bg-white">
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                radius="none"
                color="primary"
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600"
                startContent={<Send size={16} />}
              >
                Submit Quote Request
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                We will review your request and send you a detailed quote within 24 hours
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
