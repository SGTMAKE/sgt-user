"use client";

import Image from "next/image";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

// Define types for FAQ
interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { question: "What is SGTMake?", answer: "SGTMake is a leading provider of custom cable solutions..." },
  { question: "What industries do you serve?", answer: "We serve industries such as automotive, aerospace, and telecommunications..." },
  { question: "How can I contact your customer support?", answer: "You can contact us via email at support@sgtmake.com or call us at +91 9462223735" },
  { question: "What are your business hours?", answer: "Our business hours are Monday to Friday, 9 AM - 5 PM..." },
  { question: "How can I track my orders?", answer: "You can track your orders using the tracking ID sent to your email..." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-2">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-100"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <FaMinus className="text-gray-500" /> : <FaPlus className="text-gray-500" />}
            </button>
            {openIndex === index && <p className="p-4 text-gray-600">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}



// Define types for GetQuoteCard
interface GetQuoteCardProps {
  text: string;
}

export function GetQuote() {
  return (
    <div className="flex flex-wrap">
      <GetQuoteCard text="Contact Us" />
      <GetQuoteCard text="Share Details" />
      <GetQuoteCard text="Add Attachments" />
      <GetQuoteCard text="Set Timeline" />
    </div>
  );
}

function GetQuoteCard({ text }: GetQuoteCardProps) {
  return (
    <div className="p-7 rounded-lg border border-[#807B7B3D] bg-[#FAFAFA] shadow-md flex flex-col items-center justify-center text-center m-3 h-40 w-44">
      <div className="text-xl font-semibold">{text}</div>
    </div>
  );
}

// Define types for ServicesWarrantyCard
interface ServicesWarrantyCardProps {
  Question: string;
  Answer: string;
}

export function ServicesWarranty() {
  return (
    <div>
      {/* <ServicesWarrantyCard
        Question="01. Warranty Period"
        Answer="SGTMake is committed to the quality and durability of our products. We offer a standard warranty period of 2 years from the date of purchase. This warranty covers defects in materials and workmanship under normal use. During this period, we will repair or replace, at our discretion, any product that proves to be defective, free of charge."
      /> */}
     

       {/* Payment Section */}
       <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">01. Payment</h3>
        <p className="text-gray-700">
          Full payment is required before production begins. We accept bank transfers, UPI, and other approved digital
          methods. Your order will only move to production after payment confirmation. For custom or bulk orders,
          advance payment terms may vary slightly depending on project scope and mutual agreement with our team.
        </p>
      </div>

      {/* Warranty Section */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">02. Warranty</h3>
        <p className="text-gray-700">
          All products are covered under a limited warranty ranging from 3 to 12 months, depending on the product type.
          This warranty applies only to manufacturing defects. It does not cover wear and tear, accidental damage, or
          unauthorised modifications. Warranty claims must be supported with proof of purchase and clear evidence of the
          issue.
        </p>
      </div>

      <ServicesWarrantyCard
        Question="03. Coverage Details"
        Answer="Our warranty covers defects in materials and workmanship that arise during normal use. This includes failures due to faulty components or manufacturing errors. We will repair or replace the defective part or product, ensuring it functions according to its intended specifications. If a direct replacement is not available, we will provide a comparable product or component. This warranty is limited to the original purchaser and is non-transferable."
      />
      <ServicesWarrantyCard
        Question="04. Exclusion"
        Answer="While we stand behind the quality of our products, certain exclusions apply to our warranty. Damage caused by misuse, abuse, neglect, accidents, unauthorized repairs, or modifications is not covered. Normal wear and tear, cosmetic damage, and damage resulting from improper installation or environmental factors are also excluded. Additionally, consumable items and accessories are not covered under this warranty. Please refer to the product manual for detailed information on proper usage and maintenance."
      />
      <ServicesWarrantyCard
        Question="05. Warranty Registration Information"
        Answer="To ensure prompt service and to activate your warranty, we encourage you to register your product within 2 days of purchase. Warranty registration can be completed online through our website or by submitting the enclosed registration card. Registering your product allows us to keep you informed about product updates, recalls, and special offers. It also streamlines the warranty claim process, ensuring faster and more efficient service."
      />

      {/* Refund Section */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-red-800">06. Refund</h3>
        <p className="text-gray-700">
          Refunds are only available if cancellation is requested before the production process begins. Once production
          has started, no refunds will be issued. If there is a verified manufacturing defect or order error from our
          end, a partial or full refund may be granted upon review and approval by our support team.
        </p>
      </div>

      {/* Replacement Section */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-green-800">07. Replacement</h3>
        <p className="text-gray-700">
          If you receive a damaged, defective, or incorrect product, please report the issue within 7 days of delivery.
          After verifying the claim, we will offer a free replacement or correction. Products must be unused and
          returned in original packaging. We do not cover damage caused during customer handling or installation.
        </p>
      </div>
    </div>
  );
}

function ServicesWarrantyCard({ Question, Answer }: ServicesWarrantyCardProps) {
  return (
    <div className="p-2 sm:p-6">
      <div className="text-xl font-semibold">{Question}</div>
      <div className=" font-normal mt-1">{Answer}</div>
    </div>
  );
}
export interface CardProps {
  img: string
  title: string
}

export function Card({ img, title }: CardProps) {
  return (
    <div className="rounded-lg border p-3 flex flex-col items-center w-40 text-center h-40">
    <Image width={70} height={70} src={img} alt={title} className="mb-2" />
    <span className="font-bold text-sm">{title}</span>
  </div>
  )
}

export function HowToOrder() {
  const processSteps: CardProps[] = [
    { img: "/confirmplan.png", title: "Confirm Plan" },
    { img: "/production.png", title: "In Production" },
    { img: "/transpot.png", title: "Transportation" },
    { img: "/delivered.png", title: "Delivered" },
  ]

  return (
    <div className="space-y-8">
      {/* Process Overview */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Our Process</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {processSteps.map((step, index) => (
            <Card key={index} img={step.img} title={step.title} />
          ))}
        </div>
      </div>

      {/* Detailed Process Steps */}
      <div className="space-y-6">
        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="text-lg font-semibold text-orange-600 mb-2">1. Confirm Plan</h4>
          <p className="text-gray-700">
            Share your design, drawings, or concept. Our team reviews specifications, suggests improvements if needed,
            and confirms the final plan before moving into production.
          </p>
        </div>

        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="text-lg font-semibold text-blue-600 mb-2">2. In Production</h4>
          <p className="text-gray-700">
            We start manufacturing using advanced tools and high-quality materials. Each part goes through precision
            machining, quality checks, and testing to meet your exact specifications.
          </p>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="text-lg font-semibold text-green-600 mb-2">3. Transportation</h4>
          <p className="text-gray-700">
            Once your order is ready, we carefully pack and dispatch it using trusted logistics partners, ensuring safe
            and timely delivery to your location.
          </p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="text-lg font-semibold text-purple-600 mb-2">4. Delivered</h4>
          <p className="text-gray-700">
            Your finished product arrives on time, ready for immediate use or further assembly. We ensure everything
            meets your expectations and is production-ready.
          </p>
        </div>
      </div>

     
    </div>
  )
}
