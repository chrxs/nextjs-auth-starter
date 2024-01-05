import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { auth } from "@/auth";
import { Providers } from "@/components";
import AuthLoading from "@/components/AuthLoading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`bg-primary p-2 h-screen ${inter.className}`}>
        <Providers session={session}>
          <AuthLoading>{children}</AuthLoading>
        </Providers>
      </body>
    </html>
  );
}
