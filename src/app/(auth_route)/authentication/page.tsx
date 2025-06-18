"use client";

import { AuthForm } from "@/components/form/auth-form";


const SignUp = () => {
  

  return (
    <div className="flex min-h-screen w-full items-start justify-center md:py-20">
      <div className="flex h-screen w-full flex-col gap-7 px-5 py-10 md:h-max md:w-fit md:rounded-3xl md:bg-white md:p-14 md:shadow-2xl">
        <h1 className="text-3xl font-light">Sign in/Create account</h1>
        <div className="flex flex-col gap-5">
          <AuthForm />
       
        </div>
      </div>
    </div>
  );
};

export default SignUp;
