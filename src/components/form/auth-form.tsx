"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { motion as m } from "framer-motion"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useCreateAccount } from "@/api-hooks/user/create-user-account"
import type { UserResProps } from "@/lib/types/types"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"


// Updated Zod schema to include name field for signup
const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const SignUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function AuthForm() {
  const [isPassword, setIsPassword] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") // Get callback url from cookie to redirect after login success.

  // Create separate forms for signin and signup
  const signinForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signInWithGoogle = async () => {
    try {
      await signIn("google",{callbackUrl: callbackUrl || "/"});
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  

  const signupForm = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function handleSignIn(data: z.infer<typeof SignInSchema>) {
    setError(null)
    setIsLoading(true)

    try {
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl || "/",
      })

      if (signInResponse?.error) {
        signinForm.reset()
        throw new Error("Invalid credentials.")
      }
      toast.success("Signed in successfully. redirecting...")
      deleteCookie("originCallbackUrl") // Delete callbackUrl cookie after successful login
      router.refresh()
      router.replace(signInResponse?.url || "/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onSuccess = (data: UserResProps, variables: z.infer<typeof SignUpSchema>) => {
    toast.success("Account created successfully!")
    // Auto sign in after account creation with email and password
    handleSignIn({ email: variables.email, password: variables.password })
  }

  const onError = ({ response }: { response: any }) => {
    setError(response.data.message)
  }

  const mutation = useCreateAccount(onSuccess, onError)

  async function handleCreateAccount(data: z.infer<typeof SignUpSchema>) {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <div>
      {/* Custom tabs implementation */}
      <div className="mb-6 flex w-full border-b border-slate-200">
        <Button
          className={`flex-1 rounded-none border-b-2 bg-transparent px-8 py-2 font-medium ${
            activeTab === "signin"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            setActiveTab("signin")
            setError(null)
            signupForm.reset() // Reset signup form when switching to signin
          }}
          type="button"
          variant="light"
        >
          Sign In
        </Button>
        <Button
          className={`flex-1 rounded-none border-b-2 bg-transparent px-8 py-2 font-medium ${
            activeTab === "signup"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            setActiveTab("signup")
            setError(null)
            signinForm.reset() // Reset signin form when switching to signup
          }}
          type="button"
          variant="light"
        >
          Sign Up
        </Button>
      </div>

      {activeTab === "signin" ? (
        <Form {...signinForm}>
          <form>
            <FormField
              control={signinForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signinForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      endContent={
                        isPassword ? (
                          <Eye className="cursor-pointer text-gray-400" onClick={() => setIsPassword(false)} />
                        ) : (
                          <EyeOff className="cursor-pointer" onClick={() => setIsPassword(true)} />
                        )
                      }
                      type={isPassword ? "password" : "text"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <m.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className="mt-3 block h-5 text-center text-xs text-destructive"
              >
                {error}
              </m.span>
            ) : (
              <span className="mt-3 block h-5" />
            )}
            <div className="mt-5">
              <Button
                isLoading={isLoading}
                color="primary"
                onClick={signinForm.handleSubmit(handleSignIn)}
                radius="full"
                type="button"
                className="w-full"
              >
                Sign in
              </Button>
            </div>

            <div className="flex w-full items-center gap-2 my-3">
            <hr className="w-full border-zinc-300" />
            OR
            <hr className="w-full border-zinc-300" />
          </div>
          <Button

            onClick={signInWithGoogle}
            color="primary"
            variant="bordered"
            radius="full"
            className="!border w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign In with Google
          </Button>
          </form>
        </Form>
      ) : (
        <Form {...signupForm}>
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      placeholder="Name"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      endContent={
                        isPassword ? (
                          <Eye className="cursor-pointer text-gray-400" onClick={() => setIsPassword(false)} />
                        ) : (
                          <EyeOff className="cursor-pointer" onClick={() => setIsPassword(true)} />
                        )
                      }
                      type={isPassword ? "password" : "text"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <m.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className="mt-3 block h-5 text-center text-xs text-destructive"
              >
                {error}
              </m.span>
            ) : (
              <span className="mt-3 block h-5" />
            )}
            <div className="mt-5">
              <Button
                isLoading={mutation.isLoading}
                color="primary"
                onClick={signupForm.handleSubmit(handleCreateAccount)}
                radius="full"
                type="button"
                className="w-full"
              >
                Create account
              </Button>
            </div>
        </Form>
      )}
    </div>
  )
}
