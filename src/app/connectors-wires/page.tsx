"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAddFastenerToCart } from "@/api-hooks/cart/add-fastener-to-cart"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { getCookie, setCookie } from "cookies-next"
import Image from "next/image"

type TabType = "Harness Wires" | "Silicon Wires" | "Connectors"
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
type ConnectorGender = "Male" | "Female" | "Set"
type WireSize = "8 AWG" | "10 AWG" | "12 AWG" | "14 AWG" | "22 AWG" | "20 AWG" | "17 AWG"
type WireColor = "Red" | "Black" | "Yellow" | "Green" | "Blue" | "Pink" | "Brown" | "White"
type WireLength = "5" | "10" | "30" | "custom"

// Base schema for all products
const baseSchema = z.object({
  quantity: z.number().min(1, "Quantity is required"),
  remarks: z.string().optional(),
})

// Connector schema
const connectorSchema = baseSchema.extend({
  connectorType: z.string().min(1, "Connector type is required"),
  type: z.string().min(1, "Type is required"),
  pins: z.string().optional(),
  size: z.string().optional(),
})

// Wire schema
const wireSchema = baseSchema.extend({
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  length: z.string().min(1, "Length is required"),
})

export default function ConnectorsWiresPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabType>("Connectors")
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | null>(null)

  // Set up form validation based on active tab
  const getValidationSchema = () => {
    switch (activeTab) {
      case "Connectors":
        return connectorSchema
      case "Silicon Wires":
      case "Harness Wires":
        return wireSchema
      default:
        return baseSchema
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationSchema()),
    defaultValues: {
      quantity: 1,
      remarks: "",
      connectorType: "",
      type: "",
      pins: "",
      size: "",
      color: "",
      length: "",
    },
  })

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSelectedConnector(null)
    reset({
      quantity: 1,
      remarks: "",
      connectorType: "",
      type: "",
      pins: "",
      size: "",
      color: "",
      length: "",
    })
  }

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

  // Set up cart mutation
  const onSuccess = async () => {
    await queryClient.cancelQueries({ queryKey: ["user", "cart"] })
    await queryClient.invalidateQueries(["user", "cart"])
    toast.success("Item successfully added to your cart.")
  }

  const onMutate = async () => {
    if (!session?.user) {
      const guestUserIdCookie = getCookie("guest-id")
      if (!guestUserIdCookie) {
        const guestUserIdLocal = localStorage.getItem("guest-id")
        if (guestUserIdLocal) setCookie("guest-id", guestUserIdLocal)
      }
    }
  }

  const cartMutation = useAddFastenerToCart({ onMutate, onSuccess })

  // Handle form submission
  const onSubmit = (data: any) => {
    // Format the data for the cart API
    const formattedData = formatDataForCart(data)

    // Add to cart using the same API as fasteners
    cartMutation.mutate({
      quantity: data.quantity,
      color: null, // Connectors and wires use their own color field in options
      customProduct: formattedData,
    })
  }

  // Format the data for the cart API
  const formatDataForCart = (data: any) => {
    let title = ""
    let image = "/placeholder.svg"
    const totalPrice = calculatePrice(data)

    if (activeTab === "Connectors") {
      title = `${data.connectorType} - ${data.type}`
      if (data.pins) title += ` - ${data.pins} Pins`
      if (data.size) title += ` - ${data.size}`
      image = "/images/connectors/connector.webp"
    } else if (activeTab === "Silicon Wires") {
      title = `Silicon Wire - ${data.size} - ${data.color} - ${data.length}m`
      image = "/images/wires/silicon-wire.jpg"
    } else if (activeTab === "Harness Wires") {
      title = `Harness Wire - ${data.size} - ${data.color} - ${data.length}m`
      image = "/images/wires/harness-wire.webp"
    }

    return {
      title,
      basePrice: totalPrice,
      offerPrice: totalPrice,
      image,
      options: {
        ...data,
        productType: activeTab,
        totalPrice,
      },
    }
  }

  // Calculate price based on selections
  const calculatePrice = (data: any): number => {
    let basePrice = 0

    // Base prices
    if (activeTab === "Connectors") {
      basePrice = 50 // Base price for connectors

      // Add price based on connector type
      if (data.connectorType === "Bullet Connectors") basePrice += 20
      else if (data.connectorType === "Tyco Connectors") basePrice += 30
      else if (data.connectorType === "Furukawa Connectors") basePrice += 40

      // Add price based on pins
      if (data.pins) {
        basePrice += Number.parseInt(data.pins) * 5
      }
    } else if (activeTab === "Silicon Wires") {
      basePrice = 30 // Base price for silicon wires

      // Add price based on size
      if (data.size === "8 AWG") basePrice += 20
      else if (data.size === "10 AWG") basePrice += 15
      else if (data.size === "12 AWG") basePrice += 10
      else if (data.size === "14 AWG") basePrice += 5

      // Add price based on length
      if (data.length) {
        basePrice += Number.parseInt(data.length) * 2
      }
    } else if (activeTab === "Harness Wires") {
      basePrice = 25 // Base price for harness wires

      // Add price based on size
      if (data.size === "22 AWG") basePrice += 5
      else if (data.size === "20 AWG") basePrice += 10
      else if (data.size === "17 AWG") basePrice += 15

      // Add price based on length
      if (data.length) {
        basePrice += Number.parseInt(data.length) * 1.5
      }
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

  // Connector descriptions from documentation
  const connectorDescriptions: Record<ConnectorType, { images: string; description: string }> = {
    "QS 8": {
      images: "/Connectors/QS8.png",
      description:
        "High-current anti-spark connector, commonly used in battery packs and powertrains for electric vehicles, drones, and robotics.",
    },
    "QS 10": {
      images: "/Connectors/QS10-connectors.png",
      description:
        "Heavy-duty version of QS8 with larger terminals. Suitable for higher voltage and current EV systems, industrial motors, and large battery modules.",
    },
    "Bullet Connectors": {
      images: "/Connectors/Bullet-Connector-8-mm.jpg",
      description:
        "Simple plug-and-play connectors for quick connections in low to medium power applications like RC models, LED strips, and DIY electronics.",
    },
    "Chogory Connectors": {
      images: "/Connectors/Chogory-connector.jpg",
      description:
        "Waterproof automotive-style connectors widely used in EV wiring harnesses and battery systems. Known for secure locking and durability.",
    },
    "Anderson Connectors": {
      images: "/Connectors/sb50-anderson.jpg",
      description:
        "High-current, genderless power connectors ideal for modular battery systems, forklifts, and industrial power equipment.",
    },
    "Tyco Connectors": {
      images: "/Connectors/Tyco-amp-superseal.jpg",
      description:
        "Automotive-grade connectors from TE Connectivity. Common in OEM wiring harnesses, offering high vibration resistance and secure mating.",
    },
    "Furukawa Connectors": {
      images: "/Connectors/Furukawa-Connectors.png",
      description:
        "Premium Japanese connectors used in automotive and EV wiring harnesses. Known for precision, high reliability, and weather resistance.",
    },
    "ZT2023-A": {
      images: "/Connectors/ZT2023-A.jpg",
      description:
        "Compact, multi-pin automotive/industrial connector designed for high-density applications with vibration-proof locking.",
    },
    "XT90 Connectors": {
      images: "/Connectors/XT90-connector.jpg",
      description:
        "Popular high-current connectors used in drones, e-bikes, and DIY EVs. Easy to solder and known for their strong, stable connections.",
    },
    "26 Pin Superseal": {
      images: "/Connectors/26-PIN-Superseal.jpg",
      description:
        "Sealed multi-pin connector with 26 terminals. Ideal for ECUs, BMS, and sensor modules in harsh environments requiring waterproofing.",
    },
    "34 Pin Superseal": {
      images: "/Connectors/34-PIN-superseal-set.jpg",
      description:
        "Expanded version of the Superseal connector with 34 terminals. Used for complex harnessing in EVs, controllers, and industrial equipment.",
    },
  }
  

  // Wire descriptions from documentation
  const wireDescriptions = {
    "Harness Wires":
     { images: "/Connectors/harness-wires.png",
      description: "Reliable and easy-to-use PVC insulated wires perfect for internal wiring in vehicles, appliances, machinery, or custom projects. Available in multiple sizes and colors, these wires are ideal for making neat, color-coded wiring harnesses."},
    "Silicon Wires":
     {images: "/Connectors/silicon-wires.jpg",
      description: "Flexible, heat-resistant wires designed for demanding environments like electric vehicles, robotics, battery packs, and embedded electronics. With high-temperature silicone insulation, they're perfect for applications where durability and flexibility matter."},
  }

  // Watch form values
  const formValues = watch()

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connectors & Wires</h1>

      {/* Tab Navigation */}
      <div className="flex mb-6 space-x-4">
        {["Harness Wires", "Silicon Wires", "Connectors"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 rounded-md ${
              activeTab === tab
                ? "border border-orange-500 text-orange-500"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabChange(tab as TabType)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Connector Selection (only for Connectors tab) */}
          {activeTab === "Connectors" && (
            <div className="w-full md:w-1/3">
              <h2 className="text-xl font-medium mb-4">Connectors</h2>
              <div className="flex flex-col space-y-1">
                {connectorOptions.map((connector) => (
                  <div key={connector} className="mb-2">
                    <button
                      type="button"
                      className={`text-left w-full px-4 py-2 rounded-md ${
                        selectedConnector === connector
                          ? "bg-orange-100 text-orange-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => handleConnectorSelect(connector)}
                    >
                      {connector}
                    </button>
                 
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Side - Configuration Options */}
          <div className={`w-full ${activeTab === "Connectors" ? "md:w-2/3" : ""}`}>
            {/* Connector Type Options */}
            {activeTab === "Connectors" && selectedConnector && (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-md flex flex-col-reverse lg:flex-row">
                  <div className=" w-full lg:w-1/2 my-auto">
                  <p className="font-semibold" >Description</p>
                  <p className="text-sm text-gray-700">{connectorDescriptions[selectedConnector].description}</p>
                  </div>
                  <div className=" w-full lg:w-1/2 ">
                  <Image src={connectorDescriptions[selectedConnector].images} width={700} height={600} alt={selectedConnector}  />
                  </div>
                </div>
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
              </>
            )}

            {/* Wire Options */}
            {activeTab === "Silicon Wires" && (
              <div className=" flex flex-col-reverse lg:flex-row">
                <div className="mb-4 mt-10 lg:mt-0  bg-gray-50 rounded-md ">
                  <div className=" w-full lg:w-1/2 my-auto">
                  <p className="font-semibold" >Description</p>
                  <p className="text-sm text-gray-700">{wireDescriptions["Silicon Wires"].description}</p>
                  </div>
                   {/* Size Selection */}
                <div className="mb-6">
                  <h2 className="text-base font-medium mb-2">Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {["8 AWG", "10 AWG", "12 AWG", "14 AWG"].map((size) => (
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
                    {["Red", "Black"].map((color) => (
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
                  </div>
                  {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length.message as string}</p>}
                </div>
                 
                </div>
               
                <div className=" w-full lg:w-1/2 ">
                  <Image className=" max-w-xs mx-auto lg:ml-auto sticky top-7" src={wireDescriptions["Silicon Wires"].images} width={700} height={600} alt="Silicon Wires"  />
                </div>
               
              </div>
           
            )}

            {/* Harness Wire Options */}
            {activeTab === "Harness Wires" && (
              <div className=" flex flex-col-reverse lg:flex-row">

                <div className="mb-4 mt-10 lg:mt-0  bg-gray-50 rounded-md ">
                  <div className=" w-full lg:w-1/2 my-auto">
                  <p className="font-semibold" >Description</p>
                  <p className="text-sm text-gray-700">{wireDescriptions["Harness Wires"].description}</p>
                  </div>
                  <div className="mb-6 ">
                  <h2 className="text-base font-medium mb-2">Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {["22 AWG", "20 AWG", "17 AWG"].map((size) => (
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
                  </div>
                  {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length.message as string}</p>}
                </div>
                  
                </div>
                {/* Size Selection */}
                <div className=" w-full lg:w-1/2 ">
                  <Image className=" max-w-xs mx-auto lg:ml-auto sticky top-7" src={wireDescriptions["Harness Wires"].images} width={700} height={600} alt="Harness Wires"  />
                  </div>
               
              </div>
            )}

            {/* Common Fields for All Tabs */}
            {(activeTab !== "Connectors" || (activeTab === "Connectors" && selectedConnector)) && (
              <>
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
                  disabled={cartMutation.isLoading}
                >
                  {cartMutation.isLoading ? "Adding to Cart..." : "Add to Cart"}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
