"use client";

import { useFormState } from "react-dom";

import { signInWithProvider } from "@/auth/actions";
import { SubmitButton } from "@/components";

interface Props {
  provider: string;
}

export default function OauthSignInButton({ provider }: Props) {
  const [_formState, formAction] = useFormState(
    signInWithProvider.bind(null, provider),
    null,
  );

  return (
    <form action={formAction}>
      <SubmitButton>Sign In with {provider}</SubmitButton>
    </form>
  );
}
