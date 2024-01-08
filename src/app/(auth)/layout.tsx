export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="flex flex-col h-full p-10 justify-center items-center">
      {children}
    </main>
  );
}
