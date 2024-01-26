import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { auth } from "@/auth";
import { Providers } from "@/components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APP TITLE",
  description: "",
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`bg-primary h-screen ${inter.className}`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
