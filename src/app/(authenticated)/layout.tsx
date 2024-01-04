import { auth } from "@/auth";
import Providers from "@/components/Providers";
import SideBar from "@/components/SideBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user)
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }; // filter out sensitive data

  return (
    <Providers session={session}>
      <div className="flex flex-row gap-4 h-full">
        <SideBar />

        <main className="bg-white p-4 rounded-md flex-1">{children}</main>
      </div>
    </Providers>
  );
}
