"use client";

import { useState } from "react";
import Footer from "../components/Footer";
import { FAQSection, GetQuote, HowToOrder, ServicesWarranty } from "@/app/components/SupportComponents";

// Define the type for the options
interface Option {
  label: string;
  content: JSX.Element;
}

export default function Support() {
  const options: Option[] = [
    { label: "Frequently Asked Questions", content: <FAQSection /> },
    { label: "How to Order", content: <HowToOrder /> },
    // { label: "How to Get a Quote", content: <GetQuote /> },
    // { label: "Videos", content: <p>Video is Loading until enjoy free service</p> },
    { label: "Services & Warranty", content: <ServicesWarranty /> },
  ];

  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  return (
    <>
      <div className="flex flex-col  w-full min-h-screen max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold my-4 ml-14">Support</h2>

          <div className="flex flex-col md:flex-row ">
        <aside className="md:w-1/4 border-r p-4 static md:sticky top-10 h-full">
          <nav>
            <ul className="space-y-2 4">
              {options.map((option) => (
                <li
                  key={option.label}
                  className={`px-3 py-5 cursor-pointer rounded-full text-center ${
                    selectedOption.label === option.label
                      ? "bg-orange-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="md:w-3/4 p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedOption.label}</h2>
          <div className="prose max-w-full">
            {selectedOption.content}
            {selectedOption.label === "Frequently Asked Questions" && <></>}
          </div>
        </main>
        </div>
      </div>
      <Footer />
    </>
  );
}