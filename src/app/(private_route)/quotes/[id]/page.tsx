"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, ArrowLeft, ShoppingCart, Calendar } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query";
import SmartImage from "@/components/ui/ImageCorrector"
import { ProductPrice } from "@/components/currency/price-display"
import { useAddCustomToCart } from "@/api-hooks/cart/add-custom-to-cart"
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useSession } from "next-auth/react"
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

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quoteId = params.id as string
  const [quote, setQuote] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  // const [addingToCart, setAddingToCart] = useState(false)
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    if (quoteId) {
      fetchQuoteDetail()
    }
  }, [quoteId])

  const fetchQuoteDetail = async () => {
    try {
      const response = await fetch(`/api/quote-request/${quoteId}`)
      if (response.ok) {
        const data = await response.json()
        setQuote(data.quote)
      } else {
        toast.error("Failed to load quote details")
        router.push("/quotes")
      }
    } catch (error) {
      console.error("Error fetching quote:", error)
      toast.error("Failed to load quote details")
      router.push("/quotes")
    } finally {
      setLoading(false)
    }
  }
  async function onSuccess() {
      await queryClient.cancelQueries({ queryKey: ["user", "cart"] });
      await queryClient.invalidateQueries(["user", "cart"]);
      toast.success("Product successfully added to your shopping cart.");
      cart_mutation.reset();
    }
  
    async function onMutate() {
      if (!session?.user) {
        const guestUserIdCookie = getCookie("guest-id");
        if (!guestUserIdCookie) {
          const guestUserIdLocal = localStorage.getItem("guest-id");
          if (guestUserIdLocal) setCookie("guest-id", guestUserIdLocal);
        }
      }
    }

  const cart_mutation = useAddCustomToCart({ onMutate, onSuccess });
 

  const handleAddToCart = async () => {
    if (!quote || !quote.quotedPrice) {
      toast.error("No price available for this quote")
      return
    }

    
      const customProduct = {
        title: `QUOTED ITEMS - #${quote.id.slice(-8)}`,
        basePrice: Number.parseFloat(quote.quotedPrice.toFixed(2)),
        offerPrice: Number.parseFloat(quote.quotedPrice.toFixed(2)),
        image: "/services/quote.webp",
        options: {
          notes: quote.notes,
          qid: quote.id,
        },
      }

      cart_mutation.mutate({
        quantity: 1,
        color: null,
        customProduct: customProduct,
      });
    
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h3>
            <Button onClick={() => router.push("/quotes")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quotes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/quotes")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quotes
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quote #{quote.id.slice(-8)}</h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
              <Calendar className="w-4 h-4" />
              <span>Submitted on {new Date(quote.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
              
              {/* Requested Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Requested Items ({quote.totalItems} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="">
                <div className="space-y-4  ">
                  {quote.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <SmartImage
                            src={item.image}
                            alt={item.categoryName}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.categoryName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <span className="text-sm font-medium text-orange-600">Quantity: {item.quantity}</span>
                        </div>
                        {Object.keys(item.specifications).length > 0 && (
                          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Specifications:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(item.specifications)
                                .filter(([key, value]) => key !== "quantity" && key !== "remarks" && value)
                                .map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="text-gray-500 dark:text-gray-400 capitalize">
                                      {key.replace(/_/g, " ")}:
                                    </span>
                                    <span className="ml-1 text-gray-700 dark:text-gray-300">
                                      {Array.isArray(value) ? value.join(", ") : String(value)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
     

        

          {/* Customer Notes */}
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{quote.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
          {/* Quote Summary */}
        <div className="space-y-6">
           {/* Status Timeline */}
          <div>        
                    <div className="space-y-3">
  <h5 className="font-medium text-gray-900 dark:text-white">Status Timeline</h5>
  { quote.status === "REJECTED" ? <div className="ml-8 text-lg  rounded-md border-l-3 border-orange-600 pl-3"> <span className="font-semibold text-red-500">REJECTED :</span> <span> These Items are unavailable </span> </div> : <div className="space-y-2">
    {/* Step 1: Submitted */}
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-green-600 dark:text-gray-400">Quote Submitted</span>
    </div>
    {quote.status === "PENDING" && (
      <div className="ml-8 text-xs rounded-md border-l-3 border-orange-600 pl-3">
        Waiting for admin to verify stock availability and calculate prices.
      </div>
    )}

    {/* Step 2: Quoted */}
    <div
      className={`flex items-center gap-2 text-sm ${
        quote.status === "QUOTED" ? "text-green-600" : "text-gray-400"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          quote.status === "QUOTED" ? "bg-green-500" : "bg-gray-300"
        }`}
      ></div>
      <span>Admin Reviewed & Quoted</span>
    </div>
    {quote.status === "QUOTED" && (
      <div className="ml-8 text-xs rounded-md border-l-3 border-orange-600 pl-3">
        Please add the quoted items to your cart and proceed to place the order.
      </div>
    )}

    {/* Step 3: Accepted */}
    <div
      className={`flex items-center gap-2 text-sm ${
        quote.status === "ACCEPTED" ? "text-green-600" : "text-gray-400"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          quote.status === "ACCEPTED" ? "bg-green-500" : "bg-gray-300"
        }`}
      ></div>
      <span>Quote Accepted</span>
    </div>
  </div>}
</div>

          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {quote.quotedPrice && (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quoted Price:</p>
                    <ProductPrice
                      className="text-2xl font-bold text-green-600 dark:text-green-400"
                      amount={quote.quotedPrice}
                    />
                  </div>
                  <Separator />
                </>
              )}
                {/* Actions */}
          {quote.status === "QUOTED" && quote.quotedPrice && (
            <div>
                <Button
                  onClick={handleAddToCart}
                  disabled={cart_mutation.isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  {cart_mutation.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding to Cart...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </div>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  This will add the quoted items to your cart for checkout
                </p>
            </div>
          )}
           
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{quote.totalItems}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Items</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{quote.items.length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Item Types</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge
                    className={
                      quote.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : quote.status === "QUOTED"
                          ? "bg-blue-100 text-blue-800"
                          : quote.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }
                  >
                    {quote.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="font-medium">{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
                
              </div>
            </CardContent>
          </Card>

          {/* Admin Response */}
          {quote.adminResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{quote.adminResponse}</p>
                </div>
              </CardContent>
            </Card>
          )}

          
        </div>
      </div>
    </div>
  )
}
