"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";

import { SignInSchema } from "@/auth/schemas";
import signInWithCredentials, {
  State,
} from "@/auth/actions/sign-in-with-credentials";
import { SubmitButton } from "@/components";

export default function SignInForm() {
  const [_formState, formAction] = useFormState<State, FormData>(
    signInWithCredentials,
    null,
  );

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log("form", form);
  const { register, formState } = form;
  console.log("formState", formState);
  console.log("formState", formState.errors);
  console.log("formState", formState.isValid);

  return (
    <div>
      <form action={formAction}>
        <input
          type="email"
          {...register("email")}
          placeholder="email"
          autoComplete="username"
        />
        <input
          type="password"
          {...register("password")}
          placeholder="password"
          autoComplete="current-password"
        />
        <SubmitButton>Sign In</SubmitButton>
      </form>
    </div>
  );
}
