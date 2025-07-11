"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/button"
import { toast } from "sonner"

interface FastenerCategory {
  id: string
  name: string
  description: string
  image: string
  options: FastenerOption[]
}

interface FastenerOption {
  id: string
  name: string
  label: string
  type: string
  required: boolean
  helpText?: string
  values: any[]
}

interface DynamicFastenerSelectorProps {
  onAddToQuote: (data: any) => void
  isLoading?: boolean
}

export default function DynamicFastenerSelector({ onAddToQuote, isLoading = false }: DynamicFastenerSelectorProps) {
  const [categories, setCategories] = useState<FastenerCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<FastenerCategory | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/fasteners/categories")
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories)
      } else {
        toast.error("Failed to load fastener categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load fastener categories")
    } finally {
      setLoading(false)
    }
  }

  // Dynamically build validation schema based on selected category
  const buildValidationSchema = () => {
    if (!selectedCategory) return z.object({})

    const schemaFields: Record<string, any> = {
      quantity: z.number().min(1, "Quantity must be at least 1").max(10000, "Maximum quantity is 10000"),
      remarks: z.string().optional(),
    }

    selectedCategory.options.forEach((option) => {
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

  // Reset form when category changes
  useEffect(() => {
    if (selectedCategory) {
      const defaultValues: any = {
        quantity: 1,
        remarks: "",
      }

      selectedCategory.options.forEach((option) => {
        if (option.type === "multiselect") {
          defaultValues[option.name] = []
        } else {
          defaultValues[option.name] = ""
        }
      })

      reset(defaultValues)
      setQuantity(1)
    }
  }, [selectedCategory, reset])

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10000, quantity + change))
    setQuantity(newQuantity)
    setValue("quantity", newQuantity)
  }

  const formValues: Record<string, any> = watch()

  const handleFormSubmit = (data: any) => {
    if (!selectedCategory) return

    const quoteItem = {
      type: "fastener",
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      specifications: data,
      quantity: data.quantity,
      title: generateTitle(selectedCategory, data),
      image: selectedCategory.image,
    }

    onAddToQuote(quoteItem)

    // Reset form after successful submission
    reset({
      quantity: 1,
      remarks: "",
    })
    setQuantity(1)
    toast.success("Fastener added to quote request")
  }

  const generateTitle = (category: FastenerCategory, data: any) => {
    const parts = [category.name]

    // Add key specifications to title
    category.options.forEach((option) => {
      const value = data[option.name]
      if (value && value !== "" && option.name !== "remarks" && option.name !== "quantity") {
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
            {option.values.map((optionValue: {image:string, value:string}) => (
              <button
                key={optionValue.value}
                type="button"
                value={optionValue.value}
                className={`px-3 py-2 border rounded-md transition text-sm ${
                  value === (optionValue.value )
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
                onClick={(e) => setValue(option.name as any, optionValue.value , { shouldValidate: true })}
              >
                {optionValue.value}
              </button>
            ))}
          </div>
        )

      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2">
            {option.values.map((optionValue: any) => {
              const isSelected = Array.isArray(value) && value.includes(optionValue.id || optionValue)
              return (
                <button
                  key={optionValue.id || optionValue}
                  type="button"
                  className={`px-3 py-2 border rounded-md transition text-sm ${
                    isSelected ? "bg-orange-500 text-white border-orange-500" : "hover:bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => {
                    const currentValue = Array.isArray(value) ? value : []
                    const optionId = optionValue.id || optionValue
                    const newValue = isSelected
                      ? currentValue.filter((v: any) => v !== optionId)
                      : [...currentValue, optionId]
                    setValue(option.name as any, newValue, { shouldValidate: true })
                  }}
                >
                  {optionValue.name || optionValue}
                </button>
              )
            })}
          </div>
        )

      case "text":
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder={`Enter ${option.label.toLowerCase()}`}
            {...register(option.name as any)}
          />
        )

      case "number":
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <h2 className="text-xl font-medium mb-4">Select Fastener Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`p-4 border rounded-lg text-left transition ${
                selectedCategory?.id === category.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.image && (
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="font-medium text-lg">{category.name}</h3>
              {category.description && <p className="text-sm text-gray-600 mt-1">{category.description}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      {selectedCategory && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium">Configure {selectedCategory.name}</h3>

              {selectedCategory.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-medium">
                      {option.label}
                      {option.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                  </div>

                  {option.helpText && <p className="text-xs text-gray-600">{option.helpText}</p>}

                  {renderOptionInput(option)}

                  {errors[option.name as keyof typeof errors] && (
                    <p className="text-red-500 text-sm">
                      {errors[option.name as keyof typeof errors]?.message as string}
                    </p>
                  )}
                </div>
              ))}

              {/* Quantity */}
              <div className="space-y-2">
                <h4 className="text-base font-medium">Quantity (pcs)</h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 border rounded-md hover:bg-gray-100"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    className="px-4 py-2 border rounded w-20 text-center"
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
                  <button
                    type="button"
                    className="p-2 border rounded-md hover:bg-gray-100"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10000}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message as string}</p>}
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <h4 className="text-base font-medium">Remarks</h4>
                <textarea
                  className="w-full p-3 border rounded-md"
                  placeholder="Additional specifications or requirements"
                  rows={4}
                  {...register("remarks")}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                radius="none"
                color="primary"
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Add to Quote Request
              </Button>
            </motion.div>
          </AnimatePresence>
        </form>
      )}
    </div>
  )
}
