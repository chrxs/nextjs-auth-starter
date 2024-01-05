"use client";

import { useSession } from "next-auth/react";

export default function AuthLoading({ children }: React.PropsWithChildren) {
  const { data: session, status } = useSession();
  console.log({ session, status });

  if (status === "loading") {
    return <div>Loading....</div>;
  }

  return children;
}
