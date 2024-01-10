export default function Button({
  type = "button",
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type={type}
      {...props}
      className="rounded-md bg-white primary py-2 px-6 border"
    >
      {children}
    </button>
  );
}
