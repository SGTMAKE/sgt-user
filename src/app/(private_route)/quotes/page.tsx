"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, XCircle, Mail, Calendar, ArrowRight, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { ProductPrice } from "@/components/currency/price-display"

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

export default function QuotesListPage() {
  const { data: session } = useSession()
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)

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
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "QUOTED":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-300"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <p className="text-gray-600 dark:text-gray-400">Track and manage your quote requests</p>
      </div>

      {quotes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Quote Requests</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You have not submitted any quote requests yet.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200 text-lg">
                      <Package className="w-5 h-5" />
                      Quote #{quote.id.slice(-8)}
                    </CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1`}>
                    {getStatusIcon(quote.status)}
                    {getStatusText(quote.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Quote Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{quote.totalItems}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Items</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{quote.items.length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Item Types</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Price (if quoted) */}
                  
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Quoted Price:</span>
                        {quote.quotedPrice ? <ProductPrice
                          className="text-lg font-bold text-green-600 dark:text-green-400"
                          amount={quote.quotedPrice}
                        /> : <span className="text-lg font-bold text-green-600 dark:text-green-400">PENDING</span>}
                      </div>
                    </div>
                  

                  

                  {/* View Details Button */}
                  <div>
                  <Link href={`/quotes/${quote.id}`} >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 group-hover:bg-orange-600">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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
