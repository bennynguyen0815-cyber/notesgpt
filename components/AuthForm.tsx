'use client'

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { error } from "console";
import { loginAction, signUpAction } from "@/src/app/action";
type Props = {
    type: "login" | "register";
}

function AuthForm({type} : Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

    let errorMessage: string | undefined;
    let title: string = "";
    let description: string = "";
    if (isLoginForm) {
      errorMessage = (await loginAction(email, password)).errorMessage
      title = "Logged in"
      description = "You have successfully logged in"
    } else {
      errorMessage = (await signUpAction(email, password)).errorMessage
      title = "Signed Up"
      description = "Check your email for a confirmation link"
    }

    if (!errorMessage) {
      toast.success(title, {
        description,
      })
      if (isLoginForm) {
        router.replace("/");
      }
      // For signup, don't redirect - user needs to verify email
    } else {
      toast.error("Error", {
        description: errorMessage,
      });
    }
    });
  };
    return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
            />
        </div>
        <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
            />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
            {isPending ? <Loader2 className="animate-spin"/> : isLoginForm ? "Login" : "Register"}
        </Button>
        <p className="text-xs">
            {isLoginForm ? "Don't have an account? " : "Already have an account? "}{""}
            <Link href={isLoginForm ? "/sign-up" : "/login"} 
            className='text-purple-500 underline ${isPending ? "pointer-events-none opacity-50"  : ""}'>
              {isLoginForm ? "Register" : "Login"}
            </Link>
        </p>
      </CardFooter>
    </form>
  )
}

export default AuthForm
