"use client";

import { useFormState } from "react-dom";

import { signIn } from "@/auth/actions";
import { SubmitButton } from "@/components";

export default function SigninForm() {
  const [_formState, formAction] = useFormState(signIn, null);

  return (
    <div>
      <form action={formAction}>
        <SubmitButton>Sign In</SubmitButton>
      </form>
    </div>
  );
}
