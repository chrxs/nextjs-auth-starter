"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components";

export default function SubmitButton({
  children,
  disabled = false,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? "loading..." : children}
    </Button>
  );
}
