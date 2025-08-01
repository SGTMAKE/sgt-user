"use client";

import { CurrencyProvider } from "@/context/currency-context";
import { LayoutProps } from "@/lib/types/types";
//import { NextUIProvider as Provider } from "@nextui-org/system";

const CurrencyOutProvider = ({ children }: LayoutProps) => {
  return <CurrencyProvider >{children}</CurrencyProvider>;
};

export default CurrencyOutProvider;
