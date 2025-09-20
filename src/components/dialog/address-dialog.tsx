"use client"
import { useState } from "react";
import AddressForm from "../form/address-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AddressProps, LayoutProps } from "@/lib/types/types";

const AddressDialog = ({
  action,
  address,
  children,
}: {
  action: "edit" | "add";
  address?: AddressProps;
} & LayoutProps) => {

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "add" ? "Add Address" : "Edit Address"}
          </DialogTitle>
          <AddressForm address={address} action={action} setOpen={setOpen}  />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
