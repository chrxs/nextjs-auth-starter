"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";

import { SignInSchema } from "@/auth/schemas";
import { signInWithCredentials } from "@/auth/actions";
import { SubmitButton } from "@/components";

export default function SignInForm() {
  // const [_formState, formAction] = useFormState(signInWithCredentials, null);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // console.log("form", form);

  return (
    <div>
      <form action={() => {}}>
        <SubmitButton>Sign In</SubmitButton>
      </form>
    </div>
  );
}
