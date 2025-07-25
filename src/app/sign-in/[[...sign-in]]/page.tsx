"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";

export default function SignInPaage() {
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
        <SignIn.Root>
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
          {/* {Login with credentials} */}
          <SignIn.Step name="start">
            <Clerk.Field name="identifier" className="flex flex-col gap-2">
              <Clerk.Input
                placeholder="john@gmail.com"
                className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
              />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="mt-2 text-sm underLine w-72 text-cnetre text-iconBlue"
            >
              Continue
            </SignIn.Action>
          </SignIn.Step>
          {/* {Login with credentials} */}
          <SignIn.Step name="verifications">
            <SignIn.Strategy name="password">
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="password"
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <div className="flex flex-col gap-2">
                <SignIn.Action
                  submit
                  className="mt-2 text-sm underLine w-72 text-cnetre text-iconBlue"
                >
                  Continue
                </SignIn.Action>
                <SignIn.Action
                  navigate="forgot-password"
                  className="mt-2 text-sm underLine w-72 text-cnetre "
                >
                  Forgot Password?
                </SignIn.Action>
              </div>
            </SignIn.Strategy>
            <SignIn.Strategy name="reset_password_email_code">
              <h1>Check your email</h1>
              <p className="text-sm mb-2">
                We sent a code to <SignIn.SafeIdentifier />.
              </p>

              <Clerk.Field name="code" className="flex flex-col gap-2">
                <Clerk.Input
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                  placeholder="verification code"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="mt-2 text-sm underLine w-72 text-cnetre text-iconBlue"
              >
                Continue
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>
          <SignIn.Step
            name="forgot-password"
            className="flex justify-between w-72 text-sm"
          >
            <SignIn.SupportedStrategy name="reset_password_email_code">
              <span className="underline text-iconBlue">Reset Password</span>
            </SignIn.SupportedStrategy>

            <SignIn.Action navigate="previous" className="underline">
              Go back
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step name="reset-password">
            <h1>Reset your password</h1>

            <Clerk.Field name="password">
              <Clerk.Label>New password</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>

            <Clerk.Field name="confirmPassword">
              <Clerk.Label>Confirm password</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>

            <SignIn.Action submit>Reset password</SignIn.Action>
          </SignIn.Step>

          {/* {Or Sign Up} */}
        <div className="w-72 flex items-center gap-4">
          <div className="h-px bg-borderGray flex-grow"></div>
          <span className='text-textGrayLight'> Or </span>
          <div className="h-px bg-borderGray flex-grow"></div>
           
        </div>
        <Link href='/sign-up' className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center" >Create Account</Link>
        <p className="w-72 text-xm">
          By signing up, you agree to the <span className="text-iconBlue"> Terms of Service </span> and <span className="text-iconBlue">  Privacy Policy </span>,
          including <span className="text-iconBlue"> Cookies Use </span> .
        </p>
        </SignIn.Root>
      </div>
    </div>
  );
}
