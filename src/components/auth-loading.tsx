"use client";

import { useSession } from "next-auth/react";

import { LoadingIndicator } from "@/components";

export default function AuthLoading({ children }: React.PropsWithChildren) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingIndicator />;
  }

  return children;
}
