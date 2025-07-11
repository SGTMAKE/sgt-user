"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

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

interface CategoryFastenerSelectorProps {
  category: FastenerCategory
  onAddToQuote: (data: any) => void
}

export default function CategoryFastenerSelector({ category, onAddToQuote }: CategoryFastenerSelectorProps) {
  const [quantity, setQuantity] = useState(1)

  // Dynamically build validation schema based on category options
  const buildValidationSchema = () => {
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

  // Initialize form with default values
  useEffect(() => {
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
  }, [category, reset])

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10000, quantity + change))
    setQuantity(newQuantity)
    setValue("quantity", newQuantity)
  }

  const formValues: Record<string, any> = watch()

  const handleFormSubmit = (data: any) => {
    onAddToQuote(data)

    // Reset form after successful submission
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

  const renderOptionInput = (option: FastenerOption) => {
    const value = formValues[option.name]
    const error = errors[option.name as keyof typeof errors]

    switch (option.type) {
      case "select":
        return (
          <div className="flex flex-wrap gap-2">
            {option.values.map((optionValue: any) => (
              <button
                key={optionValue.id || optionValue}
                type="button"
                className={`px-3 py-2 border rounded-md transition text-sm ${
                  value === (optionValue.id || optionValue)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-gray-100 border-gray-300 dark:hover:bg-gray-800 dark:border-gray-600"
                }`}
                onClick={() => setValue(option.name as any, optionValue.id || optionValue, { shouldValidate: true })}
              >
                {optionValue.name || optionValue}
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
                    isSelected
                      ? "bg-orange-500 text-white border-orange-500"
                      : "hover:bg-gray-100 border-gray-300 dark:hover:bg-gray-800 dark:border-gray-600"
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
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
            placeholder={`Enter ${option.label.toLowerCase()}`}
            {...register(option.name as any)}
          />
        )

      case "number":
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
            placeholder={`Enter ${option.label.toLowerCase()}`}
            {...register(option.name as any, { valueAsNumber: true })}
          />
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Configuration Options */}
        {category.options.map((option) => (
          <Card key={option.id} className="border-l-4 border-l-orange-500">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <Label className="text-base font-medium">
                    {option.label}
                    {option.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {option.helpText && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{option.helpText}</p>
                  )}
                </div>
              </div>

              {renderOptionInput(option)}

              {errors[option.name as keyof typeof errors] && (
                <p className="text-red-500 text-sm">{errors[option.name as keyof typeof errors]?.message as string}</p>
              )}
            </CardContent>
          </Card>
        ))}

        <Separator />

        {/* Quantity */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 space-y-3">
            <Label className="text-base font-medium">Quantity (pieces)</Label>
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
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message as string}</p>}
          </CardContent>
        </Card>

        {/* Remarks */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 space-y-3">
            <Label className="text-base font-medium">Additional Remarks</Label>
            <Textarea
              className="min-h-[100px]"
              placeholder="Any additional specifications, requirements, or notes..."
              {...register("remarks")}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
          Add to Quote Request
        </Button>
      </motion.div>
    </form>
  )
}
