"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FastenerActions from "./fastener-actions"
import Image from "next/image"

// Define the base fastener type
export interface FastenerOption {
  id: string
  name: string
  price?: number
  image?: string // Add this line
}

// Define the configuration for different fastener types
export interface FastenerConfig {
  type: string
  image: string
  basePrice: number
  description: string
  options: {
    [key: string]: {
      label: string
      options: FastenerOption[]
      required?: boolean
      multiSelect?: boolean
      helpText?: string
    }
  }
}

// Define the selected options type
export interface SelectedFastenerOptions {
  [key: string]: string | string[] | number
}

interface FastenerSelectorProps {
  config: FastenerConfig
  activeCategory: string
}

export default function FastenerSelector({ config, activeCategory }: FastenerSelectorProps) {
  const [quantity, setQuantity] = useState(1)

  // Dynamically build the Zod schema based on the config
  const buildValidationSchema = () => {
    const schemaFields: Record<string, any> = {
      quantity: z.number().min(1, "Quantity must be at least 1").max(100, "Maximum quantity is 100"),
      remarks: z.string().optional(),
    }

    // Add validation for each required option
    Object.entries(config.options).forEach(([key, option]) => {
      if (option.required) {
        schemaFields[key] = z.string().min(1, `${option.label} is required`)
      } else {
        schemaFields[key] = z.string().optional()
      }
    })

    return z.object(schemaFields)
  }

  const validationSchema = buildValidationSchema()

  // Set up react-hook-form with zod validation
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
    reset({
      quantity: 1,
      remarks: "",
    })
  }, [activeCategory, reset])

  // Calculate the total price based on selections
  const calculateTotalPrice = (formData: any): number => {
    let total = config.basePrice

    // Add price modifiers from selected options
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "quantity") {
        total *= Number(value)
        return
      }

      if (key === "remarks") return

      const optionConfig = config.options[key]
      if (!optionConfig) return

      const option = optionConfig.options.find((o) => o.id === value)
      if (option && option.price) total += option.price
    })

    return total
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(100, quantity + change))
    setQuantity(newQuantity)
    setValue("quantity", newQuantity)
  }

  const formValues: Record<string, any> = watch()
  const totalPrice = calculateTotalPrice(formValues)

  // Format the fastener data for the cart
  const formatFastenerData = () => {
    // Create a descriptive title based on the selected options
    const parts: string[] = [config.type]

    // Add size if available
    if (formValues.size) {
      parts.push(formValues.size as string)
    }

    // Add material if available
    if (formValues.material) {
      parts.push(formValues.material as string)
    }

    // Add length for bolts
    if (formValues.length) {
      parts.push(`${formValues.length}mm`)
    }

    // Add type information
    if (formValues.type) {
      parts.push(formValues.type as string)
    }

    // Add head type for bolts
    if (formValues.headType) {
      parts.push(`${formValues.headType} Head`)
    }

    const title = parts.join(" - ")

    return {
      ...formValues,
      fastenerType: config.type,
      image: config.image,
      totalPrice,
      title,
    }
  }

  return (
    <div className="space-y-6">
      {/* Render each option category */}
      <div className=" flex flex-col-reverse lg:flex-row justify-between" >
      <div className="space-y-6">
      <AnimatePresence mode="wait">
        <h2 className="text-lg font-medium ">Description</h2>

        <p className="text-sm text-gray-500 max-w-xl">{config.description}</p>
        {Object.entries(config.options).map(([key, optionConfig]) => {
          if (key === "remarks") return null // Handle remarks separately

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {optionConfig.helpText && (
                <span className="text-xs text-gray-700 font-semibold">{optionConfig.helpText}</span>
              )}

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {optionConfig.label}
                  {optionConfig.required && <span className="text-red-500 ml-1">*</span>}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {optionConfig.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-2 border rounded-md transition text-sm flex flex-col items-center ${
                      formValues[key] === option.id
                        ? "bg-orange-500 text-white border-orange-500"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                    onClick={() => setValue(key as "quantity" | "remarks", option.id, { shouldValidate: true })}
                  >
                    {option.image && (
                      <div className="mb-2 w-12 h-12 flex items-center justify-center">
                        <img
                          src={option.image || "/placeholder.svg"}
                          alt={option.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>

              {errors[key as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">{errors[key as keyof typeof errors]?.message as string}</p>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Quantity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="space-y-2"
      >
        <h2 className="text-lg font-medium">Quantity (pcs)</h2>
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
            className="px-4 py-2 border rounded w-16 text-center"
            value={quantity}
            {...register("quantity", { valueAsNumber: true })}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value)
              if (!isNaN(value) && value >= 1 && value <= 100) {
                setQuantity(value)
                setValue("quantity", value)
              }
            }}
            min="1"
            max="100"
          />
          <button
            type="button"
            className="p-2 border rounded-md hover:bg-gray-100"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 100}
          >
            <Plus size={16} />
          </button>
        </div>
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message as string}</p>}
      </motion.div>
      </div>
      <div >
        <Image src={config.image} width={300} height={300} className=" max-w-[250px] mx-auto w-full sticky top-10" alt={config.type}/>
      </div>
      </div>

      {/* Remarks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-lg font-medium">Remarks</h2>
        <textarea className="w-full p-3 border rounded-md" placeholder="Write here" rows={4} {...register("remarks")} />
      </motion.div>

      {/* Price Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
        className="text-right"
      >
        <p className="text-sm text-gray-600">Total Price:</p>
        <p className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</p>
      </motion.div>

      {/* Add to Cart and Buy Now Buttons */}
      <FastenerActions fastenerData={formatFastenerData()} quantity={quantity} />
    </div>
  )
}
