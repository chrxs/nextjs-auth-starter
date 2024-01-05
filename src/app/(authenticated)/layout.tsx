import { SideBar } from "@/components";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row gap-4 h-full">
      <SideBar />

      <main className="bg-white p-4 rounded-md flex-1">{children}</main>
    </div>
  );
}
