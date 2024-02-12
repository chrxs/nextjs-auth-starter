import { SideBar } from "@/components";

export default function AuthenticatedLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex flex-row gap-4 h-full p-2">
      <SideBar />

      <main className="bg-white p-4 rounded-md flex-1 drop-shadow-lg">
        {children}
      </main>
    </div>
  );
}
