"use client";

import { Button } from "@nextui-org/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      // Clear any stored data first
      localStorage.removeItem("cart-items");
      localStorage.removeItem("pendingFormData");
      localStorage.removeItem("pendingFormPage");
      localStorage.removeItem("hadPendingFile");
      localStorage.removeItem("authRedirectUrl");

      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      setIsSigningOut(false);
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  }

  return (
    <Button 
      onClick={handleSignOut} 
      color="primary"
      disabled={isSigningOut}
      className="min-w-[100px]"
    >
      {isSigningOut ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Signing out...
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
};

export default SignOutButton;
