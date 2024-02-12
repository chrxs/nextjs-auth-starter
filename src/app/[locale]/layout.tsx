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
  params: { locale },
}: React.PropsWithChildren<{ params: { locale: string } }>) {
  const session = await auth();

  // console.log("locale", locale);

  return (
    <html lang={locale}>
      <body className={`bg-primary h-screen ${inter.className}`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
