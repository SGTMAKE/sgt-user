"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, Mail, MailOpen, MessageSquare, ShoppingCart } from "lucide-react"

interface QuoteStatusStepperProps {
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "REJECTED"
  emailSent: boolean
  emailOpened: boolean
  responseReceived: boolean
}

export function QuoteStatusStepper({ status, emailSent, emailOpened, responseReceived }: QuoteStatusStepperProps) {
  const steps = [
    {
      id: "submitted",
      label: "Quote Submitted",
      description: "Your quote request has been received",
      icon: CheckCircle2,
      completed: true,
    },
    {
      id: "email_sent",
      label: "Admin Notified",
      description: "Email sent to admin team",
      icon: Mail,
      completed: emailSent,
    },
    {
      id: "email_opened",
      label: "Under Review",
      description: "Admin is reviewing your request",
      icon: MailOpen,
      completed: emailOpened,
    },
    {
      id: "response_received",
      label: "Quote Prepared",
      description: "Admin has prepared your quote",
      icon: MessageSquare,
      completed: responseReceived || status === "QUOTED" || status === "ACCEPTED",
    },
    {
      id: "status",
      label: status === "ACCEPTED" ? "Quote Accepted" : status === "QUOTED" ? "Quote Ready" : "Processing",
      description:
        status === "ACCEPTED"
          ? "Quote has been added to cart"
          : status === "QUOTED"
            ? "Quote is ready for your review"
            : status === "REJECTED"
              ? "Quote was rejected"
              : "Waiting for quote",
      icon: status === "ACCEPTED" ? ShoppingCart : status === "QUOTED" ? CheckCircle2 : Clock,
      completed: status === "QUOTED" || status === "ACCEPTED",
    },
  ]

  const getCurrentStep = () => {
    if (status === "ACCEPTED") return 4
    if (status === "QUOTED") return 3
    if (responseReceived) return 3
    if (emailOpened) return 2
    if (emailSent) return 1
    return 0
  }

  const currentStepIndex = getCurrentStep()

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      {/* Progress Line */}
      <motion.div
        className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-orange-500 to-orange-600 z-10"
        initial={{ height: "0%" }}
        animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Steps */}
      <div className="space-y-8 relative z-20">
        {steps.map((step, index) => {
          const isCompleted = step.completed
          const isActive = index === currentStepIndex
          const Icon = step.icon

          return (
            <motion.div
              key={step.id}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon Container */}
              <motion.div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-20 ${
                  isCompleted
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400"
                } ${isActive ? "ring-4 ring-orange-100 dark:ring-orange-900/30" : ""}`}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <motion.h4
                  className={`font-semibold text-base ${
                    isCompleted ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
                  animate={{
                    color: isActive
                      ? ["rgb(249, 115, 22)", "rgb(234, 88, 12)", "rgb(249, 115, 22)"]
                      : isCompleted
                        ? "rgb(17, 24, 39)"
                        : "rgb(107, 114, 128)",
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {step.label}
                </motion.h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>

                {/* Timestamp (if completed) */}
                {isCompleted && (
                  <motion.div
                    className="mt-2 text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </motion.div>
                )}

                {/* Active Indicator */}
                {isActive && !isCompleted && (
                  <motion.div
                    className="mt-2 text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1"
                    animate={{
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    In Progress
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Status Message */}
      <motion.div
        className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-orange-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {status === "ACCEPTED" && "✅ Your quote has been accepted and added to cart!"}
          {status === "QUOTED" && "📋 Your quote is ready! Review the details and add to cart when ready."}
          {status === "PENDING" && "⏳ Your quote is being processed. We'll notify you once it's ready."}
          {status === "REJECTED" && "❌ This quote was rejected. Please contact support for more information."}
        </p>
      </motion.div>
    </div>
  )
}
