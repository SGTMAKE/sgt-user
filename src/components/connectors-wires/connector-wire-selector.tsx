"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Package, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useQuoteCart } from "@/hooks/use-quote-cart"
import Image from "next/image"
import SmartImage from "../ui/ImageCorrector"

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  isActive: boolean
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

interface ConnectorWireSelectorProps {
  type: "connectors" | "wires" | "harness-wires" | "silicon-wires"
}

export default function ConnectorWireSelector({ type }: ConnectorWireSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [quantity, setQuantity] = useState(1)
  const [remarks, setRemarks] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addItem } = useQuoteCart()

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: [type, "categories"],
    queryFn: async () => {
      const endpoint = type === "connectors" ? "/api/connectors/categories" : "/api/wires/categories"
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error("Failed to fetch categories")
      return response.json()
    },
  })

  // Fetch options for selected category
  const { data: options = [], isLoading: optionsLoading } = useQuery({
    queryKey: [type, "options", selectedCategory?._id],
    queryFn: async () => {
      if (!selectedCategory) return []
      const endpoint =
        type === "connectors"
          ? `/api/connectors/categories/${selectedCategory._id}/options`
          : `/api/wires/categories/${selectedCategory._id}/options`
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error("Failed to fetch options")
      return response.json()
    },
    enabled: !!selectedCategory,
  })

  // Reset form when category changes
  useEffect(() => {
    setFormData({})
    setQuantity(1)
    setRemarks("")
  }, [selectedCategory])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category")
      return
    }

    // Validate required fields
    const requiredFields = options.filter((option: Option) => option.required)
    const missingFields = requiredFields.filter((field: Option) => !formData[field.name])

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.map((f: Option) => f.label).join(", ")}`)
      return
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1")
      return
    }

    setIsSubmitting(true)

    try {
      // Add to quote cart
      const quoteItem = {
        id: `${selectedCategory._id}-${Date.now()}`,
        type: type === "connectors" ? ("connector" as const) : ("wire" as const),
        categoryId: selectedCategory._id,
        categoryName: selectedCategory.name,
        title: `${selectedCategory.name} - Custom Configuration`,
        quantity,
        specifications: {
          ...formData,
          remarks: remarks || undefined,
        },
        image: selectedCategory.image,
      }

      addItem(quoteItem)
      toast.success("Item added to quote cart!")

      // Reset form
      setFormData({})
      setQuantity(1)
      setRemarks("")
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFormField = (option: Option) => {
    const value = formData[option.name] || ""

    switch (option.type) {
      case "select":
        return (
          <div key={option._id} className="space-y-2">
            <Label htmlFor={option.name} className="text-sm font-medium">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val:any) => handleInputChange(option.name, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${option.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {option.values?.map((val) => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {option.helpText && <p className="text-xs text-gray-500">{option.helpText}</p>}
          </div>
        )

      case "number":
        return (
          <div key={option._id} className="space-y-2">
            <Label htmlFor={option.name} className="text-sm font-medium">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={option.name}
              type="number"
              value={value}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
              placeholder={`Enter ${option.label.toLowerCase()}`}
            />
            {option.helpText && <p className="text-xs text-gray-500">{option.helpText}</p>}
          </div>
        )

      case "textarea":
        return (
          <div key={option._id} className="space-y-2">
            <Label htmlFor={option.name} className="text-sm font-medium">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={option.name}
              value={value}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
              placeholder={`Enter ${option.label.toLowerCase()}`}
              rows={3}
            />
            {option.helpText && <p className="text-xs text-gray-500">{option.helpText}</p>}
          </div>
        )

      default:
        return (
          <div key={option._id} className="space-y-2">
            <Label htmlFor={option.name} className="text-sm font-medium">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={option.name}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
              placeholder={`Enter ${option.label.toLowerCase()}`}
            />
            {option.helpText && <p className="text-xs text-gray-500">{option.helpText}</p>}
          </div>
        )
    }
  }

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Categories List */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {type === "connectors" ? "Connector" : "Wire"} Categories
            </h3>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No categories available</p>
                  </div>
                ) : (
                  categories.map((category: Category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedCategory?._id === category._id
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <SmartImage
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            {!selectedCategory ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a {type === "connectors" ? "connector" : "wire"} category from the list to configure your
                  specifications
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Category Header */}
                <div className="flex items-start gap-4">
                  {selectedCategory.image ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <SmartImage
                        src={selectedCategory.image || "/placeholder.svg"}
                        alt={selectedCategory.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedCategory.name}</h3>
                    {selectedCategory.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedCategory.description}</p>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      {type === "connectors" ? "Connector" : "Wire"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Configuration Form */}
                {optionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-600">Loading options...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Dynamic Options */}
                    {options.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {options.map((option: Option) => renderFormField(option))}
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium">
                        Quantity <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        className="w-32"
                      />
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
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                      >
                        {isSubmitting ? (
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
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
