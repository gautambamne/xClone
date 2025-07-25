"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="h-screen flex items-center justify-between p-8">
      {/* Logo Section - No Changes */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img src="/icons/logo.svg" alt="My Logo" width="320" height="320" />
      </div>

      {/* Main Content Section - CORRECTED */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h1 className="text-2xl xsm:text-4xl md:text-6xl font-bold">
          Happening now
        </h1>
        <h1 className="text-2xl">Join today</h1>

        {/* Move the Sign-in buttons inside this div */}
        <SignUp.Root>
          <SignUp.Step name="start" className="flex flex-col gap-4">
            {/* Add a wrapper div to stack the buttons */}
            <div className="flex flex-col gap-4 mt-4">
              <Clerk.Connection
                name="google"
                className="bg-white rounded-full p-2 text-black w-72 flex items-center justify-center gap-2 font-bold"
              >
                <img
                  src="/icons/google.svg"
                  alt="Google logo"
                  width={24}
                  height={24}
                />
                Sign in with google
              </Clerk.Connection>
              <Clerk.Connection
                name="apple"
                className="bg-white rounded-full p-2 text-black w-72 flex items-center justify-center gap-2 font-bold"
              >
                <img
                  src="/icons/apple.svg"
                  alt="Apple logo"
                  width={24}
                  height={24}
                />
                Sign in with apple
              </Clerk.Connection>
            </div>
            <div className="flex flex-col gap-4">
              Sign up with credentials
              <Clerk.Field name="username" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placholder:text-sm"
                  placeholder="Username"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placholder:text-sm"
                  placeholder="E-mail"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="password"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <SignUp.Captcha />
              <SignUp.Action
                submit
                className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center"
              >
                Sign up
              </SignUp.Action>
            </div>
          </SignUp.Step>
          <SignUp.Step name="verifications">
            <SignUp.Strategy name="email_code">
              <h1 className="text-sm mb-2">Check your e-mail</h1>
              <Clerk.Field name= 'code' className="flex flex-col gap-4"> 
                <Clerk.Input placeholder="Verification Code" className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"/>
                  <Clerk.FieldError className="text-red-300 text-sm"/>
              </Clerk.Field>
              <SignUp.Action
              submit
              className="mt-2 underline text-iconBlue text-sm">
                Verify
              </SignUp.Action>
            </SignUp.Strategy>
          </SignUp.Step>

          {/* {Or Sign Up} */}
          <div className="w-72 flex items-center gap-4">
            <div className="h-px bg-borderGray flex-grow"></div>
            <span className="text-textGrayLight"> Or </span>
            <div className="h-px bg-borderGray flex-grow"></div>
          </div>
          <Link
            href="/sign-in"
            className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center"
          >
            Already have an account?
          </Link>
          <p className="w-72 text-sm">
            By signing up, you agree to the{" "}
            <span className="text-iconBlue"> Terms of Service </span> and{" "}
            <span className="text-iconBlue"> Privacy Policy </span>, including{" "}
            <span className="text-iconBlue"> Cookies Use </span> .
          </p>
        </SignUp.Root>
      </div>
    </div>
  );
}
