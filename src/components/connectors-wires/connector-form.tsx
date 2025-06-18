"use client"

import { useState } from "react"
import { Minus, Plus } from 'lucide-react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type ConnectorType =
  | "QS 8"
  | "QS 10"
  | "Bullet Connectors"
  | "Chogory Connectors"
  | "Anderson Connectors"
  | "Tyco Connectors"
  | "Furukawa Connectors"
  | "ZT2023-A"
  | "XT90 Connectors"
  | "26 Pin Superseal"
  | "34 Pin Superseal"

// Connector schema
const connectorSchema = z.object({
  connectorType: z.string().min(1, "Connector type is required"),
  type: z.string().min(1, "Type is required"),
  pins: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().min(1, "Quantity is required"),
  remarks: z.string().optional(),
})

interface ConnectorFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
}

export default function ConnectorForm({ onSubmit, isLoading }: ConnectorFormProps) {
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectorSchema),
    defaultValues: {
      connectorType: "",
      type: "",
      pins: "",
      size: "",
      quantity: 1,
      remarks: "",
    },
  })

  // Handle connector selection
  const handleConnectorSelect = (connector: ConnectorType) => {
    setSelectedConnector(connector)
    setValue("connectorType", connector)
  }

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const currentQuantity = watch("quantity")
    const newQuantity = Math.max(1, currentQuantity + change)
    setValue("quantity", newQuantity)
  }

  // Calculate price based on selections
  const calculatePrice = (data: any): number => {
    let basePrice = 50 // Base price for connectors

    // Add price based on connector type
    if (data.connectorType === "Bullet Connectors") basePrice += 20
    else if (data.connectorType === "Tyco Connectors") basePrice += 30
    else if (data.connectorType === "Furukawa Connectors") basePrice += 40

    // Add price based on pins
    if (data.pins) {
      basePrice += Number.parseInt(data.pins) * 5
    }

    // Multiply by quantity
    return basePrice * data.quantity
  }

  // Connector options
  const connectorOptions: ConnectorType[] = [
    "QS 8",
    "QS 10",
    "Bullet Connectors",
    "Chogory Connectors",
    "Anderson Connectors",
    "Tyco Connectors",
    "Furukawa Connectors",
    "ZT2023-A",
    "XT90 Connectors",
    "26 Pin Superseal",
    "34 Pin Superseal",
  ]

  // Watch form values
  const formValues = watch()

  const handleFormSubmit = (data: any) => {
    // Add calculated price and product type
    data.totalPrice = calculatePrice(data)
    data.productType = "Connectors"
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Connector Selection */}
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-medium mb-4">Connectors</h2>
          <div className="flex flex-col space-y-1">
            {connectorOptions.map((connector) => (
              <button
                key={connector}
                type="button"
                className={`text-left px-4 py-2 rounded-md ${
                  selectedConnector === connector ? "bg-orange-100 text-orange-500" : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleConnectorSelect(connector)}
              >
                {connector}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Configuration Options */}
        <div className="w-full md:w-2/3">
          {selectedConnector && (
            <>
              {/* Type Selection */}
              <div className="mb-6">
                <h2 className="text-base font-medium mb-2">Type</h2>
                <div className="flex space-x-2">
                  {["Male", "Female", "Set"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`px-4 py-2 rounded-md border ${
                        formValues.type === type ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
                      }`}
                      onClick={() => setValue("type", type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message as string}</p>}
              </div>

              {/* Pins Selection (for specific connector types) */}
              {(selectedConnector === "Tyco Connectors" || selectedConnector === "Furukawa Connectors") && (
                <div className="mb-6">
                  <h2 className="text-base font-medium mb-2">Pins</h2>
                  <div className="flex flex-wrap gap-2">
                    {["1", "2", "3", "4", "5", "6", "8", "9"].map((pin) => (
                      <button
                        key={pin}
                        type="button"
                        className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                          formValues.pins === pin ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
                        }`}
                        onClick={() => setValue("pins", pin)}
                      >
                        {pin}
                      </button>
                    ))}
                  </div>
                  {errors.pins && <p className="text-red-500 text-sm mt-1">{errors.pins.message as string}</p>}
                </div>
              )}

              {/* Size Selection (for Bullet Connectors) */}
              {selectedConnector === "Bullet Connectors" && (
                <div className="mb-6">
                  <h2 className="text-base font-medium mb-2">Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {["8 mm"].map((size) => (
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
              )}

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
                <textarea
                  className="w-full p-3 border rounded-md"
                  placeholder="Write here"
                  rows={4}
                  {...register("remarks")}
                />
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
            </>
          )}
        </div>
      </div>
    </form>
  )
}
