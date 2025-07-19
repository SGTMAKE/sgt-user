"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Phone, PhoneCall } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Define the validation schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  country: z.string().min(2, { message: "Please enter a valid country" }),
  inquiryDetails: z.string().min(10, { message: "Inquiry details must be at least 10 characters" }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      country: "",
      inquiryDetails: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus("success")
        reset() // Reset form after successful submission
      } else {
        throw new Error(result.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact with Our Specialized Team</h1>
          <p className="text-gray-600 mb-8">
            Please fill out the form below with your details so we can assist you better.
          </p>

          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✅ Message sent successfully!</p>
              <p className="text-green-600 text-sm">We will get back to you within 24 hours.</p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">❌ Failed to send message</p>
              <p className="text-red-600 text-sm">Please try again or contact us directly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-medium mb-2">
                  Name
                </label>
                <input
                  id="name"
                  {...register("name")}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-gray-200`}
                  placeholder="Write here"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-gray-200`}
                  placeholder="Write here"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block font-medium mb-2">
                  Company
                </label>
                <input
                  id="company"
                  {...register("company")}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Write here"
                />
              </div>
              <div>
                <label htmlFor="country" className="block font-medium mb-2">
                  Country
                </label>
                <input
                  id="country"
                  {...register("country")}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-gray-200`}
                  placeholder="Write here"
                />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="inquiryDetails" className="block font-medium mb-2">
                Inquiry Details
              </label>
              <textarea
                id="inquiryDetails"
                {...register("inquiryDetails")}
                rows={6}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.inquiryDetails ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-gray-200`}
                placeholder="Write here"
              />
              {errors.inquiryDetails && <p className="mt-1 text-sm text-red-500">{errors.inquiryDetails.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Locations and Contact Info */}
        <div className="space-y-6 text-sm md:text-base">
          {/* Contact Image */}
          <div className="relative rounded-2xl overflow-hidden h-96">
            <Image src="/contact.png" alt="Contact Us" width={800} height={300} className="object-cover h-full" />
            <Link
              href="tel:9462223735"
              className="absolute bottom-4 left-4 bg-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">Call Us</span>
              <PhoneCall size={16} />
            </Link>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6">
            {/* Email */}
            <Link
              href="mailto:business@sgtmake.com"
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <Mail className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">business@sgtmake.com</p>
              </div>
            </Link>

            {/* Phone */}
            <Link
              href="tel:9462223735"
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <Phone className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600">+91 94622 23735</p>
              </div>
            </Link>

            {/* LinkedIn */}
            <Link
              href="https://www.linkedin.com/company/sgtmake/"
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <div>
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-gray-600">SGT MAKE | Solus Global Trade LLP</p>
              </div>
            </Link>

            {/* Instagram */}
            <Link
              href="https://www.instagram.com/sgt.make?igsh=MTNhZXJnZm5iMDZzdA=="
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-gray-600">@sgt.make</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
