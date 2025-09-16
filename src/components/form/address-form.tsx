"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodAddressSchema } from "@/lib/zodSchemas"
import { Input } from "../ui/input"
import { DialogClose, DialogFooter } from "../ui/dialog"
import type { AddressProps } from "@/lib/types/types"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Truck, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@nextui-org/button"
import { Checkbox } from "@nextui-org/checkbox"
import { useState, useEffect } from "react"
import { Country, State, City } from "country-state-city"
import type { ICountry, IState, ICity } from "country-state-city"
import { Card, CardContent } from "../ui/card"
import { formatCurrency } from "@/lib/utils"
import { useShipping } from "@/context/shipping-context"
import { useCreateAddress } from "@/api-hooks/address/create-address"
import { useUpdateAddress } from "@/api-hooks/address/update-address"
import { useDeleteAddress } from "@/api-hooks/address/delete-address"

const AddressForm = ({
  address,
  action,
  orderTotal = 0,
  onSuccess: onSuccessCallback,
}: {
  address?: AddressProps
  action: "edit" | "add"
  orderTotal?: number
  onSuccess?: () => void
}) => {
  const { availableCountries, refreshCountries } = useShipping()
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const [selectedState, setSelectedState] = useState<IState | null>(null)
  const [states, setStates] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])
  const [shippingInfo, setShippingInfo] = useState<any>(null)

  const form = useForm<z.infer<typeof ZodAddressSchema>>({
    resolver: zodResolver(ZodAddressSchema),
    defaultValues: address ?? {
      is_default: false,
      name: "",
      phone: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      landmark: "",
      alternate_phone: "",
    },
  })

  const watchedCountry = form.watch("country")
  const watchedState = form.watch("state")

  // Initialize country on mount
  useEffect(() => {
    const countryName = form.getValues("country")
    if (countryName) {
      const country = Country.getAllCountries().find((c) => c.name === countryName)
      if (country) {
        setSelectedCountry(country)
        setStates(State.getStatesOfCountry(country.isoCode))

        const stateName = form.getValues("state")
        if (stateName) {
          const state = State.getStatesOfCountry(country.isoCode).find((s) => s.name === stateName)
          if (state) {
            setSelectedState(state)
            setCities(City.getCitiesOfState(country.isoCode, state.isoCode))
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    if (watchedCountry) {
      const country = Country.getAllCountries().find((c) => c.name === watchedCountry)
      if (country && country.isoCode !== selectedCountry?.isoCode) {
        setSelectedCountry(country)
        setStates(State.getStatesOfCountry(country.isoCode))
        setSelectedState(null)
        setCities([])
        form.setValue("state", "")
        form.setValue("city", "")

        // if (orderTotal > 0) {
        //   const shipping = getShippingForCountry(country.isoCode, orderTotal)
        //   setShippingInfo(shipping)
        // }
      }
    }
  }, [watchedCountry, selectedCountry, orderTotal, form])


  useEffect(()=>{
    refreshCountries()
  },[])

  useEffect(() => {
    if (watchedState && selectedCountry) {
      const state = states.find((s) => s.name === watchedState)
      if (state && state.isoCode !== selectedState?.isoCode) {
        setSelectedState(state)
        setCities(City.getCitiesOfState(selectedCountry.isoCode, state.isoCode))
        form.setValue("city", "")
      }
    }
  }, [watchedState, selectedCountry, states, selectedState, form])

  const getAvailableCountries = () => {
    return availableCountries.map((shippingCountry) => {
      const countryData = Country.getAllCountries().find((c) => c.isoCode === shippingCountry.countryCode)
      return {
        ...shippingCountry,
        flag: countryData?.flag || "",
        name: shippingCountry.countryName,
      }
    })
  }

  const onSuccess = () => {
    toast.success("Address saved successfully.")
    form.reset()
    if (onSuccessCallback) onSuccessCallback()
  }

  const create_mutation = useCreateAddress(onSuccess)
  const update_mutation = useUpdateAddress()
  const delete_mutation = useDeleteAddress()

  async function onSubmit(values: z.infer<typeof ZodAddressSchema>) {
    if (action === "add") {
      create_mutation.mutate(values)
    } else {
      update_mutation.mutate({
        address_id: address?.id,
        data: values,
      })
    }
  }

  const handleDelete = () => {
    if (!address?.id) return
    delete_mutation.mutate(address.id)
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!form.control._defaultValues.is_default && (
            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="my-3 flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      name="is_default"
                      classNames={{
                        label: "text-sm font-medium",
                      }}
                    >
                      This is my default address
                    </Checkbox>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Fullname" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Address" {...field} className="bg-gray-50" />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Locality" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Pincode" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <select
                  onChange={field.onChange}
                  value={field.value}
                  className="scrollbar-thin select w-full rounded-lg border bg-gray-50 py-2.5 text-sm"
                >
                  <option value="" disabled hidden>
                    Select Country
                  </option>
                  {getAvailableCountries().map((country) => (
                    <option value={country.name} key={country.countryCode}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <select
                  onChange={field.onChange}
                  value={field.value}
                  className="scrollbar-thin select w-full rounded-lg border bg-gray-50 py-2.5 text-sm"
                  disabled={!selectedCountry || states.length === 0}
                >
                  <option value="" disabled hidden>
                    {!selectedCountry
                      ? "Select Country First"
                      : states.length === 0
                        ? "No States Available"
                        : "Select State"}
                  </option>
                  {states.map((state) => (
                    <option value={state.name} key={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <select
                  onChange={field.onChange}
                  value={field.value}
                  className="scrollbar-thin select w-full rounded-lg border bg-gray-50 py-2.5 text-sm"
                  disabled={!selectedState || cities.length === 0}
                >
                  <option value="" disabled hidden>
                    {!selectedState
                      ? "Select State First"
                      : cities.length === 0
                        ? "No Cities Available"
                        : "Select City"}
                  </option>
                  {cities.map((city) => (
                    <option value={city.name} key={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alternate_phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Alternate Phone (optional)" {...field} className="bg-gray-50" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Landmark (optional)" {...field} className="bg-gray-50" />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter className="flex flex-row items-center justify-between">
            {action === "edit" && (
              <div className="md:w-full">
                {!delete_mutation.isLoading ? (
                  <DeleteAddressModal onDelete={handleDelete} />
                ) : (
                  <Loader2 className="animate-spin text-destructive" />
                )}
              </div>
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="light" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                isLoading={create_mutation.isLoading || update_mutation.isLoading}
                isDisabled={!form.formState.isDirty}
                type="submit"
                color="primary"
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>

      {orderTotal > 0 && watchedCountry && shippingInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Shipping Information</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Shipping to {watchedCountry}:</span>
                <span className="font-medium">
                  {shippingInfo.isFreeShipping ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      FREE
                    </span>
                  ) : (
                    formatCurrency(shippingInfo.shippingCost)
                  )}
                </span>
              </div>

              {!shippingInfo.isFreeShipping && shippingInfo.freeShippingThreshold && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders above {formatCurrency(shippingInfo.freeShippingThreshold)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AddressForm

function DeleteAddressModal({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button color="danger" variant="light">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete address?</AlertDialogTitle>
          <AlertDialogDescription>Existing orders are not affected.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}