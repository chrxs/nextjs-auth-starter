import { signOut } from "@/auth";

export default function SignOut(props: React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" {...props}>
        Sign Out
      </button>
    </form>
  );
}
