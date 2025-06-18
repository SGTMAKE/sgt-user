"use client";

import { LayoutProps } from "@/lib/types/types";
import { NextUIProvider as Provider } from "@nextui-org/system";

const NextUIProvider = ({ children }: LayoutProps) => {
  return <Provider className="">{children}</Provider>;
};

export default NextUIProvider;
