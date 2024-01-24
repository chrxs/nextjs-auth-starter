import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { auth } from "@/auth";
import { SideBar, Providers } from "@/components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APP TITLE",
  description: "",
};

function AuthenticatedLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-row gap-4 h-full p-2">
      <SideBar />

      <main className="bg-white p-4 rounded-md flex-1 drop-shadow-lg">
        {children}
      </main>
    </div>
  );
}

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`bg-primary h-screen ${inter.className}`}>
        <Providers session={session}>
          {session ? (
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          ) : (
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
