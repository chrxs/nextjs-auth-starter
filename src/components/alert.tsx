import { cn } from "@/lib/utils";

interface Props {
  type: "success" | "error";
}

export default function Alert({
  type,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div
      className={cn("p-3 rounded border border-solid", {
        "bg-green-100 border-green-700 text-green-700": type === "success",
        "bg-red-100 border-red-700 text-red-700": type === "error",
      })}
    >
      {children}
    </div>
  );
}
