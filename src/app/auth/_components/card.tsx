import OauthSignInButton from "./oauth-sign-in-button";

const providers = ["google"];

interface Props {
  title?: string;
}

export default function Card({
  title,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div className="bg-white p-6 flex flex-col gap-4 rounded-md drop-shadow-lg w-full max-w-xl">
      {title && (
        <div className="text-center">
          <h1 className="text-2xl">{title}</h1>
        </div>
      )}

      <div>{children}</div>

      <div>
        {providers.map((provider) => (
          <OauthSignInButton key={provider} provider={provider} />
        ))}
      </div>
    </div>
  );
}
