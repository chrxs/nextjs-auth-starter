"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components";

export default function SubmitButton({ children }: React.PropsWithChildren) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? "loading..." : children}
    </Button>
  );
}
