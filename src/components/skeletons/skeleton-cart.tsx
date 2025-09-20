import { repeat } from "@/lib/utils";
import Skeleton from "./skeleton";
import Container from "../container";
const SkeletonCart = () => {
  return (
    <div className="flex items-start gap-4">

       <Container className="py-0 md:py-0">
            <h1 className="text-center text-3xl">Checkout</h1>
            <div className="mx-auto max-w-3xl py-5">
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[30%]" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="my-3 h-4 w-[90%]" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-[30%]" />
        <Skeleton className="h-4 w-[30%]" />
      </div>
    </div>
              <div className="w-full bg-white pb-7 shadow">
                <div className="border-b px-5 py-3">
                  <h2 className="text-muted-foreground">Order summary</h2>
                </div>
    <div className="flex w-full items-center gap-3 border-b px-5 py-5">
      <Skeleton className="h-20 w-20 flex-shrink-0" />
      <div>
        <Skeleton className="h-5" />
        <div className="flex items-center gap-2">
          <Skeleton className="mt-3 h-8 w-24" />
          <Skeleton className="mt-3 h-5 w-14" />
        </div>
      </div>
      <div className="ms-auto">
        <Skeleton className="mb-2 h-5 w-14" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
    <div className="mt-10 grid grid-cols-2 px-5">
            <div className="col-span-2 md:col-start-2">
                  { repeat(4).map((index) => (<div className="my-2 flex justify-between" key={index}>
                        <Skeleton className=" h-6 w-24" />
                        <Skeleton className="h-5 w-14" /></div>))
                  }
            </div>
                <Skeleton className="h-5 w-14" />
                </div>
            </div>
        </div>
        </Container>
    </div>
         
    
  );
};

export default SkeletonCart;
