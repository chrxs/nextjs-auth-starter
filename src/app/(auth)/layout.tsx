import OauthSignInButton from "./oauth-sign-in-button";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  const providers = ["google"];

  return (
    <main className="flex flex-col h-full p-10 justify-center items-center">
      <div className="bg-white p-10 flex flex-col gap-4 rounded-md">
        <div>
          <h1>Sign In</h1>
        </div>
        <div>{children}</div>
        <div>
          {providers.map((provider) => (
            <OauthSignInButton key={provider} provider={provider} />
          ))}
        </div>
      </div>
    </main>
  );
}
