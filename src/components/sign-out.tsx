"use client";

import { useFormState } from "react-dom";

import { signOut } from "@/auth/actions";
import SubmitButton from "./submit-button";

export default function SignOut(props: React.ComponentPropsWithRef<"button">) {
  const [_formState, formAction] = useFormState(signOut, null);

  return (
    <form action={formAction}>
      <SubmitButton type="submit" {...props}>
        Sign Out
      </SubmitButton>
    </form>
  );
}
