export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <header className="flex-none text-white">
        <div>LOGO</div>
      </header>

      <main className="flex flex-col flex-1 items-center justify-center">
        {children}
      </main>

      <footer className="flex-none text-white/70 text-sm">
        &copy; copyright SOMETHING {new Date().getFullYear()}
      </footer>
    </div>
  );
}
