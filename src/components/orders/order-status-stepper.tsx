"use client"
import { CheckCircle, Clock, Package, Truck, Home } from "lucide-react"
import { motion } from "framer-motion"

interface OrderStatusStepperProps {
  currentStatus: string
  paymentVerified: boolean
  orderDate: Date
}

const OrderStatusStepper = ({ currentStatus, paymentVerified, orderDate }: OrderStatusStepperProps) => {
  const steps = [
    {
      id: "placed",
      label: "Order Placed",
      icon: CheckCircle,
      description: "Your order has been placed successfully",
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      icon: CheckCircle,
      description: "Your order has been confirmed and is being prepared",
    },
    {
      id: "processing",
      label: "Processing",
      icon: Package,
      description: "Your order is being processed",
    },
    {
      id: "ongoing",
      label: "Shipped",
      icon: Truck,
      description: "Your order has been shipped",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: Home,
      description: "Your order has been delivered",
    },
  ]

  const getStepStatus = (stepId: string) => {
    if (!paymentVerified && stepId !== "placed") return "pending"

    const statusOrder = ["placed", "confirmed", "processing", "shipped", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    const stepIndex = statusOrder.indexOf(stepId)

    if (stepIndex <= currentIndex) return "completed"
    if (stepIndex === currentIndex + 1) return "current"
    return "pending"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-600"
      case "current":
        return "text-blue-600 bg-blue-100 border-blue-600"
      default:
        return "text-gray-400 bg-gray-100 border-gray-300"
    }
  }

  const getLineColor = (index: number) => {
    const status = getStepStatus(steps[index].id)
    return status === "completed" ? "bg-green-600" : "bg-gray-300"
  }

  if (!paymentVerified) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Payment Failed</h3>
            <p className="text-sm text-red-600">Your payment was not successful. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-6">Order Status</h3>

      <div className="relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon

          return (
            <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-16 -ml-px">
                  <motion.div
                    className={`w-full h-full ${getLineColor(index)}`}
                    initial={{ height: 0 }}
                    animate={{ height: status === "completed" ? "100%" : "0%" }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  />
                </div>
              )}

              {/* Step Icon */}
              <motion.div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${getStatusColor(status)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Icon className="w-4 h-4" />
              </motion.div>

              {/* Step Content */}
              <div className="ml-4 flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h4
                    className={`text-sm font-medium ${
                      status === "completed"
                        ? "text-green-800"
                        : status === "current"
                          ? "text-blue-800"
                          : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      status === "completed"
                        ? "text-green-600"
                        : status === "current"
                          ? "text-blue-600"
                          : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                  {status === "current" && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-xs text-blue-600">In Progress</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderStatusStepper
