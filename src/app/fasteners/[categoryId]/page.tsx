"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { useQuoteCart } from "@/hooks/use-quote-cart"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import SmartImage from "@/components/ui/ImageCorrector"

interface FastenerCategory {
  id: string
  name: string
  description: string
  image: string
  options: FastenerOption[]
  isActive: boolean
}

interface FastenerOption {
  _id: string
  categoryId: string
  name: string
  label: string
  type: string
  required: boolean
  helpText?: string
  values: FastenerOptionValue[]
}

interface FastenerOptionValue {
  value: string
  image?: string
}

export default function FastenerCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  const [category, setCategory] = useState<FastenerCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useQuoteCart()

  useEffect(() => {
    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/fasteners/categories/${categoryId}`)
      const data = await response.json()

      if (data.success) {
        setCategory(data.category)
      } else {
        toast.error("Category not found")
        router.push("/fasteners")
      }
    } catch (error) {
      console.error("Error fetching category:", error)
      toast.error("Failed to load category")
      router.push("/fasteners")
    } finally {
      setLoading(false)
    }
  }

  // Build validation schema
  const buildValidationSchema = () => {
    if (!category) return z.object({})

    const schemaFields: Record<string, any> = {
      quantity: z.number().min(1, "Quantity must be at least 1").max(10000, "Maximum quantity is 10000"),
      remarks: z.string().optional(),
    }

    category.options.forEach((option) => {
      if (option.required) {
        if (option.type === "multiselect") {
          schemaFields[option.name] = z.array(z.string()).min(1, `${option.label} is required`)
        } else {
          schemaFields[option.name] = z.string().min(1, `${option.label} is required`)
        }
      } else {
        if (option.type === "multiselect") {
          schemaFields[option.name] = z.array(z.string()).optional()
        } else {
          schemaFields[option.name] = z.string().optional()
        }
      }
    })

    return z.object(schemaFields)
  }

  const validationSchema = buildValidationSchema()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      quantity: 1,
      remarks: "",
    },
  })

  // Initialize form when category loads
  useEffect(() => {
    if (category) {
      const defaultValues: any = {
        quantity: 1,
        remarks: "",
      }

      category.options.forEach((option) => {
        if (option.type === "multiselect") {
          defaultValues[option.name] = []
        } else {
          defaultValues[option.name] = ""
        }
      })

      reset(defaultValues)
      setQuantity(1)
    }
  }, [category, reset])

  const formValues: Record<string, any> = watch()

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10000, quantity + change))
    setQuantity(newQuantity)
    setValue("quantity", newQuantity)
  }

  const handleAddToQuote = (data: any) => {
    if (!category) return

    const quoteItem = {
      id: uuidv4(),
      type: "fastener" as const,
      categoryName: category.name,
      specifications: data,
      quantity: data.quantity || 1,
      title: generateTitle(category, data),
      image: category.image,
    }

    addItem(quoteItem)
    toast.success("Added to quote request")

    // Reset form
    const defaultValues: any = {
      quantity: 1,
      remarks: "",
    }

    category.options.forEach((option) => {
      if (option.type === "multiselect") {
        defaultValues[option.name] = []
      } else {
        defaultValues[option.name] = ""
      }
    })

    reset(defaultValues)
    setQuantity(1)
  }

  const generateTitle = (category: FastenerCategory, specifications: any) => {
    const parts = [category.name]

    Object.entries(specifications).forEach(([key, value]) => {
      if (value && value !== "" && key !== "remarks" && key !== "quantity") {
        if (Array.isArray(value)) {
          parts.push(value.join(", "))
        } else {
          parts.push(value.toString())
        }
      }
    })

    return parts.join(" - ")
  }

  const renderOptionInput = (option: FastenerOption) => {
    const value = formValues[option.name]
    const error = errors[option.name as keyof typeof errors]

    switch (option.type) {
      case "select":
        return (
          <div className="flex flex-wrap gap-2">
            {option.values.map((optionValue: FastenerOptionValue, index: number) => (
              <button
                key={`${option.name}-${optionValue.value}-${index}`}
                type="button"
                className={`p-3 border rounded-lg  transition text-sm font-medium flex flex-col items-center gap-2 min-w-[70px] ${
                  value === optionValue.value
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
                    : "hover:bg-gray-50 border-gray-300 dark:hover:bg-gray-800 dark:border-gray-600"
                }`}
                onClick={() => setValue(option.name as any, optionValue.value, { shouldValidate: true })}
              >
                {optionValue.image && (
                  <div className=" flex items-center justify-center">
                    <SmartImage
                      src={optionValue.image || "/placeholder.svg"}
                      alt={optionValue.value}
                      width={24}
                      height={24}
                      className="object-contain w-12 h-12"
                    />
                  </div>
                )}
                <span className="text-center leading-tight">{optionValue.value}</span>
              </button>
            ))}
          </div>
        )

      case "multiselect":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {option.values.map((optionValue: FastenerOptionValue, index: number) => {
              const isSelected = Array.isArray(value) && value.includes(optionValue.value)
              return (
                <button
                  key={`${option.name}-${optionValue.value}-${index}`}
                  type="button"
                  className={`p-3 border rounded-lg transition text-sm font-medium flex flex-col items-center gap-2  ${
                    isSelected
                      ? "bg-orange-500 text-white border-orange-500 shadow-md"
                      : "hover:bg-gray-50 border-gray-300 dark:hover:bg-gray-800 dark:border-gray-600"
                  }`}
                  onClick={() => {
                    const currentValue = Array.isArray(value) ? value : []
                    const newValue = isSelected
                      ? currentValue.filter((v: any) => v !== optionValue.value)
                      : [...currentValue, optionValue.value]
                    setValue(option.name as any, newValue, { shouldValidate: true })
                  }}
                >
                  {optionValue.image && (
                    <div className=" flex items-center justify-center">
                      <SmartImage
                        src={optionValue.image || "/placeholder.svg"}
                        alt={optionValue.value}
                        
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-center leading-tight">{optionValue.value}</span>
                </button>
              )
            })}
          </div>
        )

      case "text":
        return (
          <input
            type="text"
            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder={`Enter ${option.label.toLowerCase()}`}
            {...register(option.name as any)}
          />
        )

      case "number":
        return (
          <input
            type="number"
            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder={`Enter ${option.label.toLowerCase()}`}
            {...register(option.name as any, { valueAsNumber: true })}
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <Package className="w-16 h-16 text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">The requested fastener category could not be found.</p>
            <Button onClick={() => router.push("/fasteners")} className="bg-orange-500 hover:bg-orange-600">
              Back to Fasteners
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto px-4 ">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/fasteners")}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 "
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Fasteners
            </Button>
          </div>

          <div className=" flex flex-col-reverse md:grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
           
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-2">
              <form onSubmit={handleSubmit(handleAddToQuote)} className="space-y-6">
                {/* Description */}
                <Card >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
                  </CardContent>
                </Card>

                {/* Configuration Options */}
                {category.options.map((option) => (
                  <div key={option._id} >
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          {option.label}
                          {option.required && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                        {option.helpText && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.helpText}</p>
                        )}
                      </div>

                      {renderOptionInput(option)}

                      {errors[option.name as keyof typeof errors] && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors[option.name as keyof typeof errors]?.message as string}
                        </p>
                      )}
                  </div>
                ))}

                {/* Quantity */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quantity (pcs)</h4>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <input
                        type="number"
                        className="px-4 py-2 border rounded w-24 text-center dark:bg-gray-800 dark:border-gray-600"
                        value={quantity}
                        {...register("quantity", { valueAsNumber: true })}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (!isNaN(value) && value >= 1 && value <= 10000) {
                            setQuantity(value)
                            setValue("quantity", value)
                          }
                        }}
                        min="1"
                        max="10000"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10000}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-2">{errors.quantity.message as string}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Remarks */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Remarks</h4>
                    <Textarea className="min-h-[100px]" placeholder="Write here" {...register("remarks")} />
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                >
                  Add to Quote Request
                </Button>
              </form>
            </div>

            {/* Product Image */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent >
                  <div className="  bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center my-3 ">
                    {category.image ? (
                      <SmartImage
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={200}
                        height={200}
                        className="object-contain w-full max-w-sm min-h-72 h-min"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white ">{category.name}</h3>
                  </div>

                  
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
