"use client"
import { Minus, Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type WireType = "Harness Wires" | "Silicon Wires"

// Wire schema
const wireSchema = z.object({
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  length: z.string().min(1, "Length is required"),
  quantity: z.number().min(1, "Quantity is required"),
  remarks: z.string().optional(),
})

interface WireFormProps {
  wireType: WireType
  onSubmit: (data: any) => void
  isLoading: boolean
}

export default function WireForm({ wireType, onSubmit, isLoading }: WireFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(wireSchema),
    defaultValues: {
      size: "",
      color: "",
      length: "",
      quantity: 1,
      remarks: "",
    },
  })

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const currentQuantity = watch("quantity")
    const newQuantity = Math.max(1, currentQuantity + change)
    setValue("quantity", newQuantity)
  }

  // Calculate price based on selections
  const calculatePrice = (data: any): number => {
    let basePrice = wireType === "Silicon Wires" ? 30 : 25 // Base price for wires

    // Add price based on size
    if (wireType === "Silicon Wires") {
      if (data.size === "8 AWG") basePrice += 20
      else if (data.size === "10 AWG") basePrice += 15
      else if (data.size === "12 AWG") basePrice += 10
      else if (data.size === "14 AWG") basePrice += 5
    } else {
      if (data.size === "0.35 SQ mm") basePrice += 5
      else if (data.size === "0.50 SQ mm") basePrice += 10
      else if (data.size === "1 SQ mm") basePrice += 15
    }

    // Add price based on length
    if (data.length) {
      const multiplier = wireType === "Silicon Wires" ? 2 : 1.5
      basePrice += Number.parseInt(data.length) * multiplier
    }

    // Multiply by quantity
    return basePrice * data.quantity
  }

  // Define size options based on wire type
  const sizeOptions =
    wireType === "Silicon Wires" ? ["8 AWG", "10 AWG", "12 AWG", "14 AWG"] : ["0.35 SQ mm", "0.50 SQ mm", "1 SQ mm"]

  // Watch form values
  const formValues = watch()

  const handleFormSubmit = (data: any) => {
    // Add calculated price and product type
    data.totalPrice = calculatePrice(data)
    data.productType = wireType
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Size Selection */}
      <div className="mb-6">
        <h2 className="text-base font-medium mb-2">Size</h2>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              type="button"
              className={`px-4 py-2 rounded-md border ${
                formValues.size === size ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
              }`}
              onClick={() => setValue("size", size)}
            >
              {size}
            </button>
          ))}
        </div>
        {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message as string}</p>}
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <h2 className="text-base font-medium mb-2">Color</h2>
        <div className="flex flex-wrap gap-2">
          {["Red", "Black", "Yellow", "Green", "Blue", "Pink", "Brown", "White"].map((color) => (
            <button
              key={color}
              type="button"
              className={`px-4 py-2 rounded-md border ${
                formValues.color === color ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
              }`}
              onClick={() => setValue("color", color)}
            >
              {color}
            </button>
          ))}
        </div>
        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message as string}</p>}
      </div>

      {/* Length Selection */}
      <div className="mb-6">
        <h2 className="text-base font-medium mb-2">Length (m)</h2>
        <div className="flex items-center gap-2">
          {["5", "10", "30"].map((length) => (
            <button
              key={length}
              type="button"
              className={`px-4 py-2 rounded-md border ${
                formValues.length === length ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
              }`}
              onClick={() => setValue("length", length)}
            >
              {length}
            </button>
          ))}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white"
          >
            <Plus size={16} />
          </button>
        </div>
        {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length.message as string}</p>}
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <h2 className="text-base font-medium mb-2">Quantity (pcs)</h2>
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 border rounded-md hover:bg-gray-100"
            onClick={() => handleQuantityChange(-1)}
            disabled={formValues.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            className="w-16 text-center mx-2 p-2 border rounded-md"
            {...register("quantity", { valueAsNumber: true })}
            min="1"
          />
          <button
            type="button"
            className="p-2 border rounded-md hover:bg-gray-100"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus size={16} />
          </button>
        </div>
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message as string}</p>}
      </div>

      {/* Remarks */}
      <div className="mb-6">
        <h2 className="text-base font-medium mb-2">Remarks</h2>
        <textarea className="w-full p-3 border rounded-md" placeholder="Write here" rows={4} {...register("remarks")} />
      </div>

      {/* Price Display */}
      <div className="mb-6 text-right">
        <p className="text-sm text-gray-600">Total Price:</p>
        <p className="text-2xl font-bold">₹{calculatePrice(formValues).toFixed(2)}</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Adding to Cart..." : "Add to Cart"}
      </button>
    </form>
  )
}
