import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { auth } from "@/auth";
import { SideBar, Providers } from "@/components";
import AuthLoading from "@/components/AuthLoading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "",
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`bg-primary h-screen ${inter.className}`}>
        <Providers session={session}>
          <AuthLoading>
            {session ? (
              <div className="flex flex-row gap-4 h-full">
                <SideBar />

                <main className="bg-white p-4 rounded-md flex-1">
                  {children}
                </main>
              </div>
            ) : (
              children
            )}
          </AuthLoading>
        </Providers>
      </body>
    </html>
  );
}
