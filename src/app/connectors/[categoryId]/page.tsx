"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Package, Loader2, Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { useQuoteCart } from "@/hooks/use-quote-cart"
import Image from "next/image"
import SmartImage from "@/components/ui/ImageCorrector"

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
}

interface Option {
  _id: string
  categoryId: string
  name: string
  label: string
  type: "select" | "input" | "number" | "textarea"
  required: boolean
  helpText?: string
  values?: string[]
}

export default function ConnectorCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string

  const [category, setCategory] = useState<Category | null>(null)
  const [options, setOptions] = useState<Option[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [quantity, setQuantity] = useState(1)
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { addItem } = useQuoteCart()

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData()
    }
  }, [categoryId])

  const fetchCategoryData = async () => {
    setLoading(true)
    try {
      // Fetch category details
      const categoryResponse = await fetch(`/api/connectors/categories/${categoryId}`)
      const categoryData = await categoryResponse.json()

      if (categoryData.success) {
        setCategory(categoryData.category)
      }

      // Fetch category options
      const optionsResponse = await fetch(`/api/connectors/categories/${categoryId}/options`)
      const optionsData = await optionsResponse.json()

      if (optionsData.success) {
        setOptions(optionsData.options || [])
      }
    } catch (error) {
      console.error("Error fetching category data:", error)
      toast.error("Failed to load category data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleSubmit = async () => {
    if (!category) return

    // Validate required fields
    const requiredFields = options.filter((option) => option.required)
    const missingFields = requiredFields.filter((field) => !formData[field.name])

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.map((f) => f.label).join(", ")}`)
      return
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1")
      return
    }

    setSubmitting(true)

    try {
      // Add to quote cart using the same logic as fasteners
      const quoteItem = {
        id: `${category._id}-${Date.now()}`,
        type: "connector" as const,
        categoryName: category.name,
        title: `${category.name} `,
        quantity,
        specifications: {
          ...formData,
          remarks: remarks || undefined,
        },
        image: category.image,
      }

      addItem(quoteItem)
      toast.success("Connector added to quote cart!")

      // Reset form
      setFormData({})
      setQuantity(1)
      setRemarks("")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add connector to cart")
    } finally {
      setSubmitting(false)
    }
  }

  const renderOptionInput = (option: Option) => {
      const value = formData[option.name]
  
      switch (option.type) {
        case "select":
          return (
            <div className="flex flex-wrap gap-2">
              {option.values?.map((optionValue, index: number) => (
                <button
                  key={`${optionValue}-${index}`}
                  type="button"
                  className={`p-3 border rounded-lg transition text-sm font-medium flex flex-col items-center gap-2 min-w-[70px]  ${
                    value === optionValue
                      ? "bg-orange-500 text-white border-orange-500 shadow-md"
                      : "hover:bg-gray-50 border-gray-300 dark:hover:bg-gray-800 dark:border-gray-600"
                  }`}
                  onClick={() => handleInputChange(option.name as any, optionValue)}
                >
                 
                  <span className="text-center leading-tight">{optionValue}</span>
                </button>
              ))}
            </div>
          )
  
       case "textarea":
        return (
          <div key={option._id} className="space-y-2">
            <Label htmlFor={option.name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={option.name}
              value={value}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
              placeholder={`Enter ${option.label.toLowerCase()}`}
              rows={3}
              className="w-full"
            />
            {option.helpText && <p className="text-xs text-gray-500 dark:text-gray-400">{option.helpText}</p>}
          </div>
        )

      default:
  
        case "number":
        return (
          <div key={option._id} className="space-y-2">
            <Label htmlFor={option.name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={option.name}
              type="number"
              value={value}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
              placeholder={`Enter ${option.label.toLowerCase()}`}
              className="w-full"
            />
            {option.helpText && <p className="text-xs text-gray-500 dark:text-gray-400">{option.helpText}</p>}
          </div>
        )
  
      
      }
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading connector details...</span>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connector Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested connector category could not be found.</p>
          <Button onClick={() => router.push("/connectors-wires")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Connectors
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto  dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/connectors-wires")}
              className="text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Connectors
            </Button>
          </div>
          <div className=" flex flex-col-reverse md:grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Info */}
           

            {/* Configuration Form */}
            <Card className="col-span-1 lg:col-span-2">
             
              <CardContent className="space-y-6">

                {/* Dynamic Options */}
                 <div className="flex items-start gap-4">
                 
                  <div className="flex-1 pt-3">
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">{category.name}</CardTitle>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{category.description}</p>
                    )}
                    <Badge
                      variant="secondary"
                      className="mt-3 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    >
                      Connector
                    </Badge>
                  </div>
                </div>
                
                {options.length > 0 && (
                  
                  <div className="space-y-4">{options.map((option) => <>
                    <div key={option._id} className="space-y-2">
                      
                      <Label htmlFor={option.name} className="text-sm font-semibold text-black-700 dark:text-gray-300">
                        {option.label}
                        {option.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderOptionInput(option)}
                     </div>
                    </>)}</div>
                )}

                <Separator />

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-sm font-medium">
                    Additional Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Quote Cart
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

             <Card className="col-span-1 ">
              <CardHeader className="static md:sticky top-0 left-0">
                {category.image ? (
                    <div className=" rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 ">
                      <SmartImage
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={230}
                        height={230}
                        className="object-cover w-full h-72   "
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-10 h-10 text-orange-500" />
                    </div>
                  )}
              </CardHeader>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
