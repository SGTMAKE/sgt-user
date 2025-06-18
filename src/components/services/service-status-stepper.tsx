"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, FileText, DollarSign, ThumbsUp, Cog, Package, Truck, ClipboardCheck } from "lucide-react"
import { FaShippingFast } from "react-icons/fa"

interface ServiceStatusStepperProps {
  status: string
  serviceType: string
}

export function ServiceStatusStepper({ status, serviceType }: ServiceStatusStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Define steps based on service type
  const getSteps = () => {
    const baseSteps = [
      { id: "pending", label: "Requested", icon: <Clock className="h-6 w-6" /> },
      { id: "approved", label: "Review & Approved", icon: <ThumbsUp className="h-6 w-6" /> },
      { id: "production", label: "In Production", icon: <Cog className="h-6 w-6" /> },
      { id: "testing", label: "Quality Test", icon: <ClipboardCheck className="h-6 w-6" /> },
      { id: "shipped", label: "Shipped", icon: <FaShippingFast className="h-6 w-6" /> },
      { id: "delivered", label: "Delivered", icon: <CheckCircle2 className="h-6 w-6" /> },

    ]

    // Add shipping step for physical products
    if (["cnc-machining", "laser-cutting", "3d-printing"].includes(serviceType)) {
      baseSteps.splice(5, 0, {
        id: "ready_for_shipping",
        label: "Ready for Shipping",
        icon: <Package className="h-6 w-6" />,
      })
      baseSteps.splice(6, 0, {
        id: "shipped",
        label: "Shipped",
        icon: <Truck className="h-6 w-6" />,
      })
    }

    return baseSteps
  }

  const steps = getSteps()

  // Update current step based on status
  useEffect(() => {
    const stepIndex = steps.findIndex((step) => step.id === status)
    setCurrentStep(stepIndex !== -1 ? stepIndex : 0)
  }, [status, steps])

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-xl font-bold">Service Status</h2>
        <div className="mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-500">
          {steps[currentStep]?.label || "Processing"}
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-1/3 left-5 right-5 h-1 -translate-y-1/2 bg-orange-200 rounded-full">
            <motion.div
              className="h-[90%] bg-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep
              const isActive = index === currentStep

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    className={`flex items-center justify-center w-12 h-12 rounded-full z-10 ${
                      isCompleted ? "bg-orange-500 text-white" : "bg-white border-2 border-gray-300 text-gray-400"
                    } ${isActive ? "ring-4 ring-orange-100" : ""}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isCompleted ? "text-orange-600" : "text-gray-500"}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep
            const isActive = index === currentStep

            return (
              <div
                key={step.id}
                className={`flex items-center p-3 rounded-lg ${
                  isActive
                    ? "bg-orange-50 border border-orange-200"
                    : isCompleted
                      ? "bg-gray-50"
                      : "bg-white border border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 ${
                    isCompleted ? "bg-orange-500 text-white" : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <p className={`font-medium ${isCompleted ? "text-orange-600" : "text-gray-500"}`}>{step.label}</p>
                  {isActive && <p className="text-sm text-orange-600">Current status</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
