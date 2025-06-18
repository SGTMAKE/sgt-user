"use client"
import { useState } from "react"
import { FileText, Download, Eye, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency, formateDateString } from "@/lib/utils"

interface QuotationItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface QuotationCardProps {
  id: string
  serviceType: string
  status: "pending" | "sent" | "approved" | "rejected"
  quotationItems?: QuotationItem[]
  totalAmount?: number
  validUntil?: Date
  notes?: string
  createdAt: Date
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

const QuotationCard = ({
  id,
  serviceType,
  status,
  quotationItems = [],
  totalAmount = 0,
  validUntil,
  notes,
  createdAt,
  onApprove,
  onReject,
}: QuotationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "sent":
        return <FileText className="w-4 h-4 text-blue-600" />
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "sent":
        return "bg-blue-50 text-blue-800 border-blue-200"
      case "approved":
        return "bg-green-50 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200"
    }
  }

  return (
    <motion.div
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quotation #{id.slice(-8)}</h3>
              <p className="text-sm text-gray-600 capitalize">{serviceType.replace("-", " ")}</p>
              <p className="text-xs text-gray-500">{formateDateString(createdAt)}</p>
            </div>
          </div>

          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-xs font-medium capitalize">{status}</span>
          </div>
        </div>

        {/* Amount */}
        {totalAmount > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
            {validUntil && <span className="text-xs text-gray-500">Valid until {formateDateString(validUntil)}</span>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
          </button>

          <div className="flex space-x-2">
            {status === "sent" && (
              <>
                <button
                  onClick={() => onReject?.(id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => onApprove?.(id)}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Approve
                </button>
              </>
            )}
            <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            className="mt-4 pt-4 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {quotationItems.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                <div className="space-y-2">
                  {quotationItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="text-gray-900">{item.description}</p>
                        <p className="text-gray-500">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default QuotationCard
