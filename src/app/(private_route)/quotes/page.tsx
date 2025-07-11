"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Clock, CheckCircle, XCircle, Mail, ShoppingCart, Calendar, IndianRupee } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

interface QuoteRequest {
  id: string
  items: Array<{
    type: "fastener" | "connector" | "wire"
    categoryId: string
    categoryName: string
    title: string
    quantity: number
    specifications: Record<string, any>
    image?: string
  }>
  notes: string
  totalItems: number
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "REJECTED"
  emailSent: boolean
  emailOpened: boolean
  responseReceived: boolean
  adminResponse?: string
  quotedPrice?: number
  createdAt: string
  updatedAt: string
}

export default function UserQuotesPage() {
  const { data: session } = useSession()
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchQuotes()
    }
  }, [session])

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quote-request")
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.quotes || [])
      } else {
        toast.error("Failed to load quotes")
      }
    } catch (error) {
      console.error("Error fetching quotes:", error)
      toast.error("Failed to load quotes")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (quote: QuoteRequest) => {
    if (!quote.quotedPrice) {
      toast.error("No price available for this quote")
      return
    }

    setAddingToCart(quote.id)

    try {
      // Calculate price per item
      const pricePerItem = quote.quotedPrice / quote.totalItems

      // Add each item to cart as custom product
      for (const item of quote.items) {
        const customProduct = {
          title: `${item.categoryName} - ${item.title}`,
          basePrice: pricePerItem * item.quantity,
          offerPrice: pricePerItem * item.quantity,
          image: item.image || "/placeholder.svg?height=200&width=200",
          options: {
            ...item.specifications,
            fastenerType: item.type,
            categoryName: item.categoryName,
            quotedItem: true,
            quoteId: quote.id,
            originalQuantity: item.quantity,
            pricePerUnit: pricePerItem,
          },
        }

        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: item.quantity,
            color: null,
            customProduct: customProduct,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to add ${item.categoryName} to cart`)
        }
      }

      // Update quote status to ACCEPTED
      await fetch(`/api/quote-request/${quote.id}/accept`, {
        method: "POST",
      })

      toast.success("All quoted items added to cart successfully!")
      fetchQuotes() // Refresh quotes
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add items to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />
      case "QUOTED":
        return <Mail className="w-4 h-4" />
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />
      case "REJECTED":
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "QUOTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Awaiting Quote"
      case "QUOTED":
        return "Quote Received"
      case "ACCEPTED":
        return "Quote Accepted"
      case "REJECTED":
        return "Quote Rejected"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Quote Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your quote requests and add approved items to cart</p>
      </div>

      {quotes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Quote Requests</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't submitted any quote requests yet.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/fasteners">
                <Button className="bg-orange-500 hover:bg-orange-600">Browse Fasteners</Button>
              </Link>
              <Link href="/connectors-wires">
                <Button variant="outline">Browse Connectors</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote) => (
            <Card key={quote.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <Package className="w-5 h-5" />
                      Quote #{quote.id.slice(-8)}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-orange-700 dark:text-orange-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {quote.totalItems} items
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1`}>
                    {getStatusIcon(quote.status)}
                    {getStatusText(quote.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Items List */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Requested Items</h4>
                    <ScrollArea className="max-h-64">
                      <div className="space-y-3">
                        {quote.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                              {item.image ? (
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.categoryName}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {item.categoryName}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Quote Details */}
                  <div className="space-y-4">
                    {/* Status Timeline */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">Status Timeline</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">Quote Submitted</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-sm ${quote.emailSent ? "text-green-600" : "text-gray-400"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${quote.emailSent ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span>Admin Notified</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-sm ${quote.status === "QUOTED" ? "text-green-600" : "text-gray-400"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${quote.status === "QUOTED" ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span>Quote Received</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-sm ${quote.status === "ACCEPTED" ? "text-green-600" : "text-gray-400"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${quote.status === "ACCEPTED" ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span>Quote Accepted</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Information */}
                    {quote.quotedPrice && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">Quote Details</h5>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Total Price:</span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                {quote.quotedPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Per item avg:</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                ₹{(quote.quotedPrice / quote.totalItems).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Admin Response */}
                    {quote.adminResponse && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">Response Message</h5>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{quote.adminResponse}</p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Customer Notes */}
                    {quote.notes && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">Your Notes</h5>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{quote.notes}</p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Actions */}
                    {quote.status === "QUOTED" && quote.quotedPrice && (
                      <div className="pt-4">
                        <Button
                          onClick={() => handleAddToCart(quote)}
                          disabled={addingToCart === quote.id}
                          className="w-full bg-orange-500 hover:bg-orange-600"
                        >
                          {addingToCart === quote.id ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Adding to Cart...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Add All to Cart
                            </div>
                          )}
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          This will add all quoted items to your cart
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
