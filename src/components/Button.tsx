export default function Button({
  type = "button",
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type={type}
      {...props}
      className="rounded-md bg-white primary py-4 px-10"
    >
      {children}
    </button>
  );
}
