"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ShoppingCart, X, Send, Trash2, Package, FileText, ChevronDown, MessageSquareIcon } from "lucide-react"
import { useQuoteCart } from "@/hooks/use-quote-cart"
import { toast } from "sonner"
import Image from "next/image"
import { useSession, signIn } from "next-auth/react";
import SmartImage from "../ui/ImageCorrector"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function QuoteCartDropdown() {
  const { items, removeItem, clearCart, getTotalItems } = useQuoteCart()
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalItems = getTotalItems()


  

  const handleSubmitQuote = async () => {
    if (items.length === 0) {
      toast.error("Please add items to your quote request")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          notes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        setNotes("")
        setIsOpen(false)
        toast.success("Quote request submitted successfully!")
      } else {
        throw new Error(data.error || "Failed to submit quote request")
      }
    } catch (error) {
      console.error("Error submitting quote request:", error)
      toast.error("Failed to submit quote request")
    } finally {
      setIsSubmitting(false)
    }
  }

   const { data: session } = useSession();

  const handleClick = () => {
    if (!session) {
      // Redirect or open login modal
      signIn(); // This opens the sign-in page
      return;
    }

    handleSubmitQuote();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fastener":
        return <Package className="w-3 h-3" />
      case "connector":
        return <ShoppingCart className="w-3 h-3" />
      case "wire":
        return <ShoppingCart className="w-3 h-3" />
      default:
        return <Package className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fastener":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "connector":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "wire":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="relative">
      {/* Cart Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        <MessageSquareIcon className="w-5 h-5 text-orange-600" />
        {totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Dropdown for desktop, Modal for mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for desktop dropdown only */}
            <div className=" bg-black/30 hidden md:block" onClick={() => setIsOpen(false)} />

            {/* Mobile Modal (only visible on small screens) */}
            <div className="md:hidden">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-full h-full max-w-none m-0 p-0 rounded-none">
                  <div className="flex flex-col h-full">
                    <DialogHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                          <ShoppingCart className="w-5 h-5" />
                          Quote Cart
                          {totalItems > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {totalItems} {totalItems === 1 ? "item" : "items"}
                            </Badge>
                          )}
                        </DialogTitle>
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                      {items.length === 0 ? (
                        <div className="p-6 text-center space-y-3">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                            <MessageSquareIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Your Quotes cart is empty</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add products to request a quote</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          <ScrollArea className="max-h-64 p-4">
                            <div className="space-y-3">
                              {items.map((item, index) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="group"
                                >
                                  <Card className="border border-gray-200 dark:border-gray-700">
                                    <CardContent className="p-3">
                                      <div className="flex gap-3">
                                        {item.image && (
                                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                            <SmartImage
                                              src={item.image || "/placeholder.svg"}
                                              alt={item.title}
                                              className="object-cover"
                                              fill
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                              <h4 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-1">
                                                {item.title}
                                              </h4>
                                              <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                                                  {getTypeIcon(item.type)}
                                                  <span className="ml-1 capitalize">{item.type}</span>
                                                </Badge>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                  Qty: {item.quantity}
                                                </span>
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeItem(item.id)}
                                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>
                          <Separator />
                          <div className="p-4 space-y-3">
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              Additional Notes (Optional)
                            </Label>
                            <Textarea
                              placeholder="Any special requirements or notes..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="min-h-[60px] text-sm"
                            />
                          </div>
                          <Separator />
                          <div className="p-4 space-y-2">
                            <Button
                              onClick={handleClick}
                              disabled={isSubmitting}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 mr-2" />
                                  Submit Quote Request
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={clearCart}
                              disabled={isSubmitting}
                              className="w-full text-gray-600 hover:text-gray-800 border-gray-300 bg-transparent"
                              size="sm"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Clear All
                            </Button>
                          </div>
                          <div className="px-4 pb-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              🚀 Get quotes within 24 hours
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Desktop Dropdown (only visible on md and up) */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className=" top-full mt-2 w-96 z-50 hidden md:block"
            >
              <Card className="shadow-xl border-2 border-orange-200 dark:border-orange-800">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <ShoppingCart className="w-4 h-4" />
                      Quote Cart
                      {totalItems > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </Badge>
                      )}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {items.length === 0 ? (
                    <div className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                        <MessageSquareIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Your Quotes cart is empty</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add products to request a quote</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {/* Items List */}
                      <ScrollArea className="max-h-64 p-4">
                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group"
                            >
                              <Card className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-3">
                                  <div className="flex gap-3">
                                    {item.image && (
                                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                        <SmartImage
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.title}
                                          className="object-cover"
                                          fill
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <h4 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-1">
                                            {item.title}
                                          </h4>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                                              {getTypeIcon(item.type)}
                                              <span className="ml-1 capitalize">{item.type}</span>
                                            </Badge>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              Qty: {item.quantity}
                                            </span>
                                          </div>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeItem(item.id)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>

                      <Separator />

                      {/* Notes Section */}
                      <div className="p-4 space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          placeholder="Any special requirements or notes..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="p-4 space-y-2">

                        <Button
                          onClick={handleClick}
                          disabled={isSubmitting}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3 mr-2" />
                              Submit Quote Request
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={clearCart}
                          disabled={isSubmitting}
                          className="w-full text-gray-600 hover:text-gray-800 border-gray-300 bg-transparent"
                          size="sm"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Clear All
                        </Button>
                      </div>

                      {/* Info */}
                      <div className="px-4 pb-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          🚀 Get quotes within 24 hours
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
